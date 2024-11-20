document.addEventListener('DOMContentLoaded', function() {  // 当DOM加载完成时执行
  try {
    // 获取URL参数中的数据并解码
    const urlParams = new URLSearchParams(window.location.search);  // 解析URL参数
    const encodedData = urlParams.get('data');                     // 获取data参数
    
    console.log('Encoded data:', encodedData);                     // 调试日志：输出编码数据
    
    if (!encodedData) {
      throw new Error('No data parameter found in URL');           // 如果没有数据参数则抛出错误
    }
    
    const data = JSON.parse(decodeURIComponent(encodedData));      // 解码并解析JSON数据
    console.log('Decoded data:', data);                           // 调试日志：输出解码后的数据
    
    // 设置文本内容
    const textElement = document.getElementById('selectedText');    // 获取文本显示元素
    if (!textElement) {
      throw new Error('Selected text element not found in DOM');   // 如果找不到元素则抛出错误
    }
    
    if (!data.text) {
      throw new Error('No text found in data');                   // 如果数据中没有文本则抛出错误
    }
    
    textElement.textContent = data.text;                          // 设置选中的文本内容
    
    // 处理网页图标
    const faviconImg = document.getElementById('pageFavicon');     // 获取图标元素
    if (faviconImg && data.favicon) {
      faviconImg.crossOrigin = 'anonymous';                       // 设置跨域属性
      
      // 使用fetch获取图片并转换为blob URL
      fetch(data.favicon)
        .then(response => response.blob())                        // 将响应转换为blob
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);              // 创建blob URL
          faviconImg.src = blobUrl;                              // 设置图片源
        })
        .catch(error => {
          console.error('Failed to load favicon:', error);        // 加载失败时输出错误
          faviconImg.style.display = 'none';                     // 隐藏图标元素
        });
    }
    
    // 主题切换功能
    const card = document.querySelector('.card');                  // 获取卡片元素
    const themeButtons = document.querySelectorAll('.theme-btn');  // 获取所有主题按钮
    
    themeButtons.forEach(btn => {
      btn.addEventListener('click', function() {                   // 为每个按钮添加点击事件
        themeButtons.forEach(b => b.classList.remove('active'));   // 移除其他按钮的激活状态
        this.classList.add('active');                             // 激活当前按钮
        card.dataset.theme = this.dataset.theme;                  // 设置卡片主题
      });
    });
    
    // 下载功能
    document.getElementById('downloadBtn').addEventListener('click', function() {  // 添加下载按钮点击事件
      // 等待所有图片加载完成
      Promise.all(Array.from(document.images).map(img => {
        if (img.complete) {
          return Promise.resolve();
        } else {
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }
      })).then(() => {
        // 使用html2canvas将卡片转换为图片
        html2canvas(document.querySelector('.card'), {
          useCORS: true,                                          // 允许跨域
          allowTaint: true                                        // 允许图片污染画布
        }).then(canvas => {
          const link = document.createElement('a');                // 创建下载链接
          link.download = '猫猫分享卡片.png';                      // 设置下载文件名
          link.href = canvas.toDataURL();                         // 设置图片数据URL
          link.click();                                           // 触发下载
        });
      });
    });
  } catch (error) {
    console.error('Error initializing card:', error);             // 输出初始化错误
    // 显示错误信息给用户
    document.body.innerHTML = `
      <div style="color: red; padding: 20px; text-align: center;">
        加载卡片时出现错误：${error.message}
      </div>
    `;
  }
}); 