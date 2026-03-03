function openImage(img){
document.getElementById("imagePopup").style.display="flex"
document.getElementById("popupImg").src=img.src
}

function closeImage(){
document.getElementById("imagePopup").style.display="none"
}