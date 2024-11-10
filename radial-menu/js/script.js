const menuToggle = document.querySelector('.toggle'),
      menu = document.querySelector('.menu'),
      lists = document.querySelectorAll('.menu li');

menuToggle.onclick = () => {
  // lists.forEach(item => item.classList.remove('active'))
  menu.classList.toggle('active');
  menuToggle.classList.toggle('active');
}

lists.forEach(item => item.addEventListener('click', function() {
  lists.forEach( i => i.classList.remove('active'))
  this.classList.add('active')
}))