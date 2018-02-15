import React, { Component } from 'react';

import { broadcastComment } from '../../post/Write/editorActions';

class InlineCategoryEdit extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            value: props.value
        }

        this.onCategoryChange = this.onCategoryChange.bind(this);
		
    }

    onCategoryChange (e) {
		const value = e.target.value;
		
        this.setState({
            value: e.target.value
        });
		
		const type = this.props.types.filter((t) => {
			return t.type == value;
		})[0].type;
		
		console.log(type);

		const jsonMetadata = this.props.post['json_metadata'];

        const metadata = {
            ...jsonMetadata,
            type: type
        };

        const { author, body, permlink, title, reward_weight, parent_permlink, parent_author } = this.props.post;

        broadcastComment(
          parent_author,
          parent_permlink,
          author,
          title,
          body,
          metadata,
          permlink,
          reward_weight
      ).then((res) => {
          console.log(res);
      });

    }


    render () {
        const types = this.props.types.map((type, idx) => (
            <option value={type.type} key={idx}>{type.slug}</option>
        ))

        return (
            <div className="inline-category-edit">
                <select className="inline-category-edit-select" onChange={ this.onCategoryChange }>
                    {types}
                </select>
            </div>
        );
    }
}

export default InlineCategoryEdit;