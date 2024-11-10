const wheel = document.querySelector('.wheel'),
      spinBtn = document.querySelector('.spinBtn');
let value = Math.ceil(Math.random() * 3600)

spinBtn.onclick =  function() {
    wheel.style.transform = `rotate(${value}deg)`
    value += Math.ceil(Math.random() * 3600)
}