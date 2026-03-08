/*----------------------------------page 5--------------*/
const moreTrBtn = document.getElementById("more-tr-btn");
const gallery = document.getElementsByClassName("grid-photos")[0];

let k = 0;
const formats = ["png","jpg","jpeg","webp"];

moreTrBtn.addEventListener("click" , ()=>{

    for(let i = k; i < k + 4; i++) {

        let img = document.createElement("img");
        let formatIndex = 0;

        function tryNextFormat(){

            if(formatIndex >= formats.length){
                img.remove();
                return;
            }

            img.src = `photos/gallery/fishph${i}.${formats[formatIndex]}`;
            formatIndex++;
        }

        img.onerror = tryNextFormat;

        tryNextFormat();
        gallery.appendChild(img);
    }

    k += 4;
});

