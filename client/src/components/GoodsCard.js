import React from "react";


export default function GoodsCard({ id, name, price, image }) {

    console.log(image)

    const deleteGoodsService = async (goodsServiceId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete your service ${name}?`)
        if (confirmDelete)
            try {
                const response = await fetch(`/delete_goods_service/${goodsServiceId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message); // Handle success
                    window.location.reload()
                } else {
                    const errorData = await response.json();
                    console.error(errorData.error); // Handle error
                }
            } catch (error) {
                console.error(error); // Handle unexpected errors
            }
    };

    return (
        <div className="goodscard">
            <br />
            <br />
            <div><b>Name:</b> {name}</div>
            <div><b>price:</b> ${price.toFixed(2)}</div>
            <br/>
            <div>{image && <img className="goodsimage" src={image} alt={`Image of ${name} from store_id ${id}`} />}</div>
            <br/>
            <button className="" onClick={() => deleteGoodsService(id)} >Remove Service</button>
            <br />
            <br />

        </div>
    )
}

