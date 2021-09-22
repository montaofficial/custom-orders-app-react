import React, { Component } from 'react';
const axios = require('axios');
const baseUrl = 'https://custom-orders.smontanari.com/api/';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            options: [],
            category: 0
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
            <div>
                {
                    this.state.options.map((category, key)=> (
                        <div className="menu-section" key={key}>
                            <div className={this.state.category == key?"menu-section-title active":"menu-section-title"} onClick={()=>{this.setState({category: key})}}>{category.name}</div>
                            {
                                this.state.category == key? <div className="menu-section-list">
                                {
                                    category.options.map((element, key2)=>(
                                        <div className="menu-section-element" key={key2}>
                                             {element.unavailable? element.name + " N.A. " + element.price: element.name + "  " + element.price}
                                        </div>
                                    ))
                                }
                            </div>: null
                            }
                        </div>
                    ))
                }
            </div>
         );
    }
}
 
export default Menu;