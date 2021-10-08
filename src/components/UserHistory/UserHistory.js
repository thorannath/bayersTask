import React from 'react';

class UserHistory extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        
    }
    render(){
        return (
            <div>
                <table>
                    <tr><td></td><td></td><td><button OnClick={this.handleChange} ></button></td></tr>
                </table>
            </div>
        );
    }
}

export default UserHistory;