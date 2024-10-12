function extractProfileData() {
  const name = document.querySelector('.text-heading-xlarge')?.textContent?.trim() || '';
  const title = document.querySelector('.text-body-medium')?.textContent?.trim() || '';
  const location = document.querySelector('.text-body-small.inline.t-black--light.break-words')?.textContent?.trim() || '';
  
  const experienceItems = document.querySelectorAll('#experience ~ .pvs-list__outer-container > ul > li');
  const experience = Array.from(experienceItems).map(item => {
    const title = item.querySelector('.t-bold')?.textContent?.trim() || '';
    const company = item.querySelector('.t-normal')?.textContent?.trim() || '';
    return `${title} at ${company}`;
  }).join('\n');

  return `Nombre: ${name}\nTítulo: ${title}\nUbicación: ${location}\n\nExperiencia:\n${experience}`;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractProfile') {
    try {
      const profileData = extractProfileData();
      sendResponse({ success: true, data: profileData });
    } catch (error) {
      sendResponse({ success: false, error: (error as Error).message });
    }
  }
  return true;
});