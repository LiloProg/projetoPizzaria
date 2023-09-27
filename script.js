//Funcao para subistituir todos os querySelectors.
let cart = []; //carrinho criado
let modalQt = 1;
let modalKey = 0;//identificaçao da pizza
const q = (el)=>document.querySelector(el);
const qAll = (el)=>document.querySelectorAll(el);

//listagem das pizzas
pizzaJson.map((item, index)=>{
    //console.log(item, index); TESTE
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    //preencher as infos em pizzaItem
    pizzaItem.setAttribute('data-key', index);//set
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}` ;
    //pizzaItem.querySelector('.pizza-item--img').innerHTML = `<img src="${item.img}" />`;
    //abrir modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault();//previna açao padrao
        //console.log('Clicou!');//teste
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');//get//especifico de mais
        modalQt = 1;
        modalKey = key;

        //img primeiro sempre
        q('.pizzaWindowArea .pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML =  `R$ ${pizzaJson[key].price}`;
        
        //descelecionar
        q('.pizzaInfo--size.selected').classList.remove('selected');
        //tamanhos pequeno, medio e grande.
        qAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQt;//quantidade de pizza do modal = modalQt

        //começar a mecher com o pizzaWindowArea - modal
        q('.pizzaWindowArea').style.opacity = '0';//animacao começo
        q('.pizzaWindowArea').style.display = 'flex';//aparecer o modal qnd clicar no a.
        setTimeout( ()=> {
            q('.pizzaWindowArea').style.opacity = '1';
        }, 200);//animaçao final
        //fecha o pizzaWindowArea - modal
        

    })    

    q('.pizza-area').append( pizzaItem );


});

//Eventos do modal
//fechar modal
function closeModal () {
    q('.pizzaWindowArea').style.opacity = '0';
    setTimeout( ()=> {
        q('.pizzaWindowArea').style.display = 'none';
    }, 200);
}
qAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton, .pizzaInfo--addButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//qnt de itens modal - ou +
//menos
q('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1) {
        modalQt --;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    } else {
        modalQt = 1;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
//mais
q('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt ++;
    q('.pizzaInfo--qt').innerHTML = modalQt;
});

//tamanho dos itens modal, pequeno, grande e medio
qAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');//e.target(da bug) seleciona o item em que o user está clicando
    });
});

//adicionar no carrinho
q('.pizzaInfo--addButton').addEventListener('click',()=>{
    //reunir todas as infos - tem que criar variaveis, olha so quem diria.
    //ql a pizza?
    //console.log(`Pizza: ${modalKey}`);
    //ql o tamanho?
    let size =  parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));//pega tamanho de 0 a 2.
    //console.log(`Tamanho: ${size}`);
    //qnts pizzas?
    //console.log(`Quantidade: ${modalQt}`);
    
    //verificar para adicionar qnt maior no pedido sem adicionar novos itens
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);//== para verificar

    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
});

//menu mobile opener
q('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0){
        q('aside').style.left = '0';
    } else {
        q('aside').style.left = '100vw';
    }

});

q('.menu-closer').addEventListener('click',()=>{
    q('aside').style.left = '100vw';
});

//atualizar o carrinho para faze ele aparecer
function updateCart() {
    q('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        //mostrar
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
                let pizzaItem = pizzaJson.find((item)=>item.id = cart[i].id);
                subtotal += pizzaItem.price * cart[i].qt;

                let cartItem = q('.models .cart--item').cloneNode(true);
                
                let pizzaSizeName;
                switch(cart[i].size) {
                    case 0:
                        pizzaSizeName = 'P';
                        break;
                    case 1:
                        pizzaSizeName = 'M';
                        break;
                    case 2:
                        pizzaSizeName = 'G';
                        break; 
                }

                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                    if(cart[i].qt > 1){
                        cart[i].qt--;
                    } else {
                        cart.splice(i,1);//remover do carrinho
                    }
                    updateCart();
                });
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                    cart[i].qt++;
                    updateCart();
                });


                q('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q('.subtotal').innerHTML = `R$ ${subtotal.toFixed(2)} `;
        q('.desconto').innerHTML = `R$ ${desconto.toFixed(2)} `;
        q('.total').innerHTML = `R$ ${total.toFixed(2)} `;
    } else {
        q('aside').classList.remove('show');
        q('aside').style.left = '100vw';
        //tirar de tela
    }
}