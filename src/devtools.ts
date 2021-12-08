console.log('devtools.ts 123')
export {}

chrome.devtools.panels.create(
  'Test Panel',
  'icon-48.png',
  'test1.html',
  (panel) => {
    console.log('panel created', panel)
  },
)
