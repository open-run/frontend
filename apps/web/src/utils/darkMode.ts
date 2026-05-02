export function toggleDarkMode() {
  const htmlElement = document.documentElement
  if (htmlElement.classList.contains('dark')) {
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}
