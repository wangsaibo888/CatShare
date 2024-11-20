let shareButton = null;

// 创建分享按钮
function createShareButton() {
  if (!shareButton) {
    try {
      const iconUrl = chrome.runtime.getURL('images/icon48.png');
      console.log('Icon URL:', iconUrl); // 调试信息

      shareButton = document.createElement('div');
      shareButton.id = 'cat-share-button';
      shareButton.innerHTML = `
        <img src="${iconUrl}" alt="分享" />
        <span class="button-text">猫猫分享</span>
      `;
      document.body.appendChild(shareButton);
      
      shareButton.addEventListener('click', openShareCard);
      
      console.log('Share button created successfully'); // 调试信息
    } catch (error) {
      console.error('Error creating share button:', error); // 错误信息
    }
  }
}

// 监听文字选择事件
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  console.log('Selected text:', selectedText); // 调试信息
  
  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    createShareButton();
    
    // 保存选中的文本，以便后续使用
    shareButton.dataset.selectedText = selectedText;
    
    // 设置按钮位置
    const top = window.scrollY + rect.bottom + 10;
    const left = window.scrollX + rect.right - (shareButton ? shareButton.offsetWidth : 0);
    
    if (shareButton) {
      shareButton.style.top = `${top}px`;
      shareButton.style.left = `${left}px`;
      shareButton.style.display = 'flex';
      
      console.log('Button positioned at:', { top, left }); // 调试信息
    }
  } else if (shareButton) {
    shareButton.style.display = 'none';
  }
});

// 打开分享卡片
function openShareCard() {
  try {
    // 从按钮的dataset中获取保存的文本
    const selectedText = shareButton.dataset.selectedText;
    const favicon = document.querySelector('link[rel="icon"]')?.href || 
                   document.querySelector('link[rel="shortcut icon"]')?.href ||
                   window.location.origin + '/favicon.ico';
    
    const cardData = {
      text: selectedText,
      favicon: favicon
    };
    
    console.log('Card data before encoding:', cardData); // 调试信息
    
    // 使用 encodeURIComponent 两次，确保特殊字符被正确编码
    const encodedData = encodeURIComponent(JSON.stringify(cardData));
    const cardUrl = chrome.runtime.getURL('card.html') + '?data=' + encodedData;
    
    console.log('Opening URL:', cardUrl); // 调试信息
    window.open(cardUrl, '_blank');
  } catch (error) {
    console.error('Error opening share card:', error); // 错误信息
  }
} 