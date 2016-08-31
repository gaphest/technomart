// СЛАЙДЕР
var slideIndex=1;

showSlides(slideIndex);

function nextSlide(n){
    slideIndex+=n;
    showSlides(slideIndex);
}

function currentSlide(n) {
    slideIndex=n;
    showSlides(slideIndex);
}

function showSlides(n){

    var slides=document.querySelectorAll('.slider-item');
    var dots=document.querySelectorAll('.slider-dots__dot');

    if(n>slides.length){
        slideIndex=1;
    }
    if(n<1){
        slideIndex=slides.length;
    }
    for(var i=0; i<slides.length; i++){
        slides[i].style.display='none';
        slides[i].classList.remove('fade');
    }
    for(var j=0; j<dots.length; j++){
        dots[j].classList.remove('slider-dots__dot--active');
    }
    
    slides[slideIndex-1].style.display='block';
    slides[slideIndex-1].classList.add('fade');
    dots[slideIndex-1].classList.add('slider-dots__dot--active');
}

(function () {
// MODAL
var form=document.querySelector('.hidden__form-wrap');
var overlay=document.querySelector('.overlay');
var map=document.querySelector('.google-map');
var minimap=document.querySelector('.features__contacts img');

//показ формы
document.querySelector('.features__contacts .btn').addEventListener('click',function(){
    form.style.display='block';
    document.querySelector('.hidden__left input').focus();
    form.classList.add('bounce');
});

//закрыть форму
document.querySelector('.close').addEventListener('click',function(){
    form.style.display='none';
    form.classList.remove('bounce');
});

window.addEventListener('keydown',function(e){
    if(e.keyCode===27){
        form.style.display='none';
        form.classList.remove('bounce');

        overlay.style.display='none';
        map.style.display='none';
    }
});

//показ карты и overlay
minimap.addEventListener('click', function(e){
    e.preventDefault();
    form.style.display='none';
    overlay.style.display='block';
    map.classList.add('bounce');
    map.style.display='block';
    initialize();
});

//закрыть карту и overlay
document.querySelector('.google-map__close').addEventListener('click',function(){
    overlay.style.display='none';
    map.style.display='none';
});

overlay.addEventListener('click',function(){
    overlay.style.display='none';
    map.style.display='none';
    form.style.display='none';
});


//ТАБЫ
var delivery=document.querySelector('.delivery');
var guarantee=document.querySelector('.guarantee');
var credit=document.querySelector('.credit');
var tabs=document.querySelectorAll('.vertical-list__item');
var tabsContent=[delivery,guarantee,credit];
var pictures=document.querySelectorAll('.services__picture');


tabs.forEach(function (item, i) {

    tabs[i].addEventListener('click', function () {
        tabs.forEach(function (item, i) {
            tabs[i].classList.remove('vertical-list__item--active');
        });
        tabsContent.forEach(function (item, i) {
            tabsContent[i].classList.remove('display-block');
            tabsContent[i].classList.add('display-none');
        });
        pictures.forEach(function (item, i) {
            pictures[i].classList.remove('display-block');
            pictures[i].classList.add('display-none');
        });

        this.classList.add('vertical-list__item--active');

        tabsContent[i].classList.remove('display-none');
        tabsContent[i].classList.add('display-block');

        pictures[i].classList.remove('display-none');
        pictures[i].classList.add('display-block')
    });

});


//ОТПРАВКА ФОРМЫ
document.querySelector('.hidden__form').addEventListener('submit',function(e){
    e.preventDefault();
    sendForm();
});

document.querySelector('.btn__wrap .btn').addEventListener('click',function(e){
    e.preventDefault();
    sendForm();
});

function sendForm(){
    var inputName=document.querySelector("input[name='name']");
    var inputMail=document.querySelector("input[name='mail']");
    var textarea=document.querySelector(".hidden__textarea textarea");

    if(inputName.value!="" && inputMail.value!="" && textarea.value!=""){
        var formData={
            who: inputName.value.trim(),
            email: inputMail.value.trim(),
            textarea: textarea.value.trim()
        };
        var jsonData=JSON.stringify(formData);
        var req=new XMLHttpRequest();
        req.open("POST","fromForm.php",true);
        req.setRequestHeader("Content-Type", "text/plain");
        req.send(jsonData);

        inputName.value="";
        inputMail.value="";
        textarea.value="";

        console.log('Форма отправлена AJAXом');
    }
    else{
        alert('Пожалуйста заполните форму');
    }
}

    //GOOGLE MAP
    var myCenter=new google.maps.LatLng(59.938783, 30.323384);

    function initialize()
    {
        var mapProp = {
            center:myCenter,
            zoom:18,
            mapTypeId:google.maps.MapTypeId.ROADMAP,

            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            scrollwheel: false
        };

        var map=new google.maps.Map(document.querySelector(".google-map__itself"),mapProp);


        var marker=new google.maps.Marker({
            position:myCenter,
            animation:google.maps.Animation.BOUNCE
        });

        marker.setMap(map);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

})();


