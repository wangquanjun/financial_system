import React, {
	Component
} from "react";

import {connect} from "dva";

@connect(
	state => ({
		
	}), {
		getSiStatus: (callback) => ({
			type: 'common/getSiStatus',
			callback
		}),
		getMeStatus: () => ({
			type: 'common/getMeStatus'
		})
		,
		getLanguageCommon: () => ({
			type: 'common/getLanguageCommon'
		}),
		getLanguageHome: () => ({
			type: 'common/getLanguageHome'
		}),
		getLanguageHXmc: () => ({
			type: 'common/getLanguageHXmc'
		})
	}
)
class index extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount (){
		this.props.getSiStatus(function(res){

		});
		// this.props.getMeStatus();
	}
	componentDidMount() {
		console.log('didmount')
		this.props.getLanguageCommon();
		this.props.getLanguageHome();
		this.props.getLanguageHXmc();
	}

	render() {
		return ( 
		<div>
		</div>
		);
	}
}

export default index;