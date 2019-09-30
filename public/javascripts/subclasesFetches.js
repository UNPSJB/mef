fetch('http://localhost:3000/subclases/api',{credentials: 'same-origin'})
.then((res)=>{
    console.log(res);
})
.catch((e)=>console.log('upsi... ' + e));