async function loadGallery() {
    const result = await fetch('http://localhost:5678/api/works')
    const data = await result.json() 
    console.log (data)
    let gallery = document.getElementsByClassName("gallery")[0]
    gallery.innerHTML = ""
    let modalGallery = document.querySelector('.mini-photo-container')
    modalGallery.innerHTML = ""
    

    data.forEach(work =>{
        let figure = document.createElement("figure") 
        let img = document.createElement("img")
        let figcaption = document.createElement("figcaption")
        img.src = work.imageUrl
        img.alt = work.title
        figcaption.textContent = work.title
        figure.appendChild(img)
        figure.appendChild(figcaption)
        figure.dataset.category = work.categoryId
        gallery.appendChild(figure)
        loadModalGallery(work)
    });
};
loadGallery();

function categoryFilters(){
    const buttons = document.querySelectorAll('button[data-filter]')
    const gallery = document.querySelectorAll('.gallery figure')
    console.log('i am filter')
    console.log(buttons)
    buttons.forEach (button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter
            gallery.forEach (item =>{
                const categoryValue = item.dataset.category
                if(filterValue === 'all'){
                    item.classList.remove ('hidden')
                    console.log(filterValue)
                }else if(filterValue == categoryValue){
                    item.classList.remove ('hidden')
                    console.log(categoryValue)
                }else{
                    item.classList.add ('hidden')
                }

            })
        })
    })

} 

function loadModalGallery(work) {
    let modalGallery = document.querySelector('.mini-photo-container')
    let img = document.createElement("img")
    let div = document.createElement('div')
    let i = document.createElement('i')
    img.src = work.imageUrl
    img.alt = work.title
    img.classList.add('mini-photo')
    i.classList.add("fa-solid")
    i.classList.add("fa-trash-can")
    i.addEventListener('click', () => deleteImg(work.id))
    div.appendChild(img)
    div.appendChild(i)
    modalGallery.appendChild(div)
    
}

async function categories() {
    const result = await fetch('http://localhost:5678/api/categories')
    const data = await result.json()
    console.log(data)
    let filters = document.getElementsByClassName("filters")[0]
    filters.innerHTML = ""

    
    let allBtn = document.createElement("button")
    allBtn.textContent = ("All")
    allBtn.dataset.filter = 'all'
    allBtn.classList.add("all", "filters", "active") 
    filters.appendChild(allBtn)

    allBtn.addEventListener("click", function() {
    document.querySelectorAll('.filters').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    });


    data.forEach(btn =>{
        let button = document.createElement("button")
        button.textContent = btn.name
        button.classList.add("filters")
        button.dataset.filter = btn.id
        filters.appendChild(button)
        let options = document.getElementById('select-category')
        let option = document.createElement('option')
        option.value = btn.id
        option.text = btn.name
        options.appendChild(option)

        button.addEventListener("click", function() {
        document.querySelectorAll('.filters').forEach(b => b.classList.remove('active'));
        
        this.classList.add('active');
    });

    });  


  categoryFilters()  
}
categories();

document.addEventListener('DOMContentLoaded', () => categoryFilters())

function checkLogin(){
    if(localStorage.getItem("token")!=null){
        document.getElementById("editingMode").style.display="flex"
        document.getElementById("edit").style.display="flex"
        document.getElementById("login").innerHTML="Logout"
        document.getElementById("login").addEventListener("click",()=>{
            localStorage.clear() 
            window.location.reload()
        })

    }
    else{
        document.getElementById("editingMode").style.display="none"
        document.getElementById("edit").style.display="none"
        document.getElementById("login").addEventListener("click",()=>{
            window.location.href="Login.html"
        })
    }
    
}
checkLogin();

async function deleteImg(id) {
    const result = await fetch(`http://localhost:5678/api/works/${id}`,{
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        }
        
     })
    
    loadGallery()
};

const titleFile = document.getElementById("select-title")
const imgFile = document.getElementById ("imgfile")
const categoryFile = document.getElementById ("select-category")
const confirmBtn = document.getElementById ("confirm")


imgFile.addEventListener('change', () => {
    const file = imgFile.files[0]; 
    if (!file) return;

    const preview = document.getElementById('preview');
    const addImgBox = document.querySelector('.add-img-box');
    
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block'
    addImgBox.style.display = 'none'

});

async function postImg() {
    let formData = new FormData();
    formData.append("image", imgFile.files[0])
    formData.append("title", titleFile.value)
    formData.append("category", categoryFile.value)
    console.log (categoryFile.value)

    const result = await fetch('http://localhost:5678/api/works', {
        method: "POST",
        headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`
        },
        body: formData,
    });

    
}; 

confirmBtn.addEventListener('click', async (e) =>{
    e.preventDefault();
    await postImg();
    await loadGallery();
});



/*Modals*/
const edit = document.getElementById("edit")
const modal = document.querySelector(".modal") 
const closeModal = document.querySelector(".fa-xmark")
const addPhoto = document.getElementById("add-photo")

const modalTwo = document.querySelector(".modal-2")
const closeModalTwo = document.querySelector(".modal-2 .fa-xmark")
const backButton = document.querySelector(".fa-arrow-left")
const plusAddPhoto = document.querySelector(".plus-img")
const overlay = document.querySelector(".overlay")

/*First modal*/
edit.addEventListener('click', () =>{ 
    modal.classList.add('show');
    modalTwo.classList.remove('show');
    overlay.classList.add('show');
}); 
 
closeModal.addEventListener('click', () =>{
    modal.classList.remove('show');
    overlay.classList.remove('show')
}); 

addPhoto.addEventListener('click', () =>{
    modal.classList.remove('show');
    modalTwo.classList.add('show');
});


/*Second modal*/
backButton.addEventListener('click', () =>{
    modal.classList.add('show');
    modalTwo.classList.remove('show');
});

closeModalTwo.addEventListener('click', () =>{
    modalTwo.classList.remove('show');
    overlay.classList.remove('show')
}); 

plusAddPhoto.addEventListener('click', (e) =>{
    e.preventDefault();
    imgFile.click();
});

 