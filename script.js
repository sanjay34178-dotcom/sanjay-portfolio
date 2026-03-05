/* Reveal animation */

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {

reveals.forEach((element) => {

const windowHeight = window.innerHeight;
const revealTop = element.getBoundingClientRect().top;
const revealPoint = 120;

if(revealTop < windowHeight - revealPoint){

element.classList.add("active");

}

});

});


/* Smooth scroll */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

anchor.addEventListener("click", function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({
behavior:"smooth"
});

});

});


/* Mobile menu */

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if(hamburger){

hamburger.addEventListener("click", () => {

navLinks.classList.toggle("active");

});

}
