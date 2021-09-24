import React, { Component } from 'react';
const axios = require('axios');
const baseUrl = 'https://custom-orders.smontanari.com/api/';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            options: [],
            order: [],
            category: 0,
            update: false
         }
    }

    async componentDidMount() {
        try {
            const response = await axios.get(baseUrl + `${this.props?.match?.params?.idRistorante}/menu`);
            console.log(response.data);
            this.setState({options: response.data});

          } catch (error) {
            console.error(error);
          }
    }

    render() { 
        return ( 
            <>
            <div className="fixed-top">
                NAVBAR
            </div>

            <div className="fixed-bottom">
                INVIA
            </div>
            <div className="menu-cliente">
                {
                    this.state.options.map((category, key)=> (
                        <div className="menu-section" key={key}>
                            <div className={this.state.category == key?"menu-section-title active":"menu-section-title"} onClick={()=>{this.setState({category: key})}}>{category.name}</div>
                            {
                                this.state.category == key? <div className="menu-section-list">
                                {
                                    category.options.map((element, key2)=>(
                                        <div className="row menu-section-element" key={key2}>
                                            <div className="col element-name">{element.name}
                                                {
                                                    element.vegan? <inline className="element-vegan">
                                                        <i className="fas fa-leaf"></i>
                                                    </inline>:null
                                                }
                                                {
                                                    element.details? <div className="element-description">
                                                        {element.details}
                                                    </div>:null
                                                }
                                            </div>
                                            <div className="col-auto price">
                                                    {
                                                        displayPrice(element.price)
                                                    }
                                            </div>
                                            <div className="col-auto select">
                                                {
                                                    this.state.order.includes(element.name)?
                                                     <div className="icon" onClick={()=>this.removeItem(element.name)}>
                                                         <i className="far fa-check-square"></i>
                                                     </div>
                                                     :<div className="icon" onClick={()=>this.addItem(element.name, category)}>
                                                     <i className="far fa-square"></i>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>: null
                            }
                        </div>
                    ))
                }
            </div>
            </>
         );
    }

    addItem (value, category)  {
        if (category.single)
            for (let element of category.options) {
                const index = this.state.order.indexOf(element.name);
                if (index > -1) {
                    this.state.order.splice(index, 1);
                }
            }
        this.state.order.push(value);
        this.setState({update: !this.state.update});
    }

    removeItem (value) {
        var index = this.state.order.indexOf(value);
        if (index > -1) {
            this.state.order.splice(index, 1);
        }
        this.setState({update: !this.state.update});
    }
}
 
function displayPrice (price) {
    if (!price) return "free";
    return `${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} €`
}

export default Menu;