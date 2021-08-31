const year=new Date().getFullYear()
document.getElementById('year').innerHTML=year;
const root=location.protocol+"//"+location.host
$('.addCart').click(function(event){
        event.preventDefault()
        const href=this.href
        console.log(href)
        $.ajax({
            url:href,
            type:'GET',
            data:{},
            success:function(){
              swal("Add successful!", "continute!", "success");
                 $("#infoNumber").load(root+" #numberCart");
            }
          })
    })
   