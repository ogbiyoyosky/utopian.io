import React, { Component } from 'react';

import { connect } from 'react-redux';

import { editContribution } from '../actions/contribution';

import './InlineTagEdit.less';

@connect(
	state => ({}), 
	{
		editContribution
	}
);

class InlineTagEdit extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            tags: [],
        }


        this.onInlineTagEditClick = this.onInlineTagEditClick.bind(this);
        this.addTag = this.addTag.bind(this);

        this.resizeInput = this.resizeInput.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleAddTagButtonClick = this.handleAddTagButtonClick.bind(this);

        this.createNewTag = this.createNewTag.bind(this);

		this.updatePostTags = this.updatePostTags.bind(this);

		this.post = props.post;

    }

    createNewTag (title = '') {
        return this.setState({
            tags: this.state.tags.concat([{
                'title': title
            }])
        })
    }

    componentWillMount() {

		const tags = this.post['json_metadata'].tags.map((tag) => {
            return {
      				title: tag
      			}
        });

		this.setState({
			tags: this.state.tags.concat(tags)
		});

		setTimeout(() => {

			const tagInputs = document.getElementsByClassName('inline-tag-edit-input');

			Array.prototype.slice.call(tagInputs).map((tagInput) => {
				return this.resizeInput(tagInput);
			});

		}, 100);

    }

    onInlineTagEditClick (event) {
        event.preventDefault();

        const index = parseInt(event.target.attributes['data-index'].value, 10);

        const tags = this.state.tags.filter((tag, tagIndex) => {
            return index != tagIndex;
        });

        this.setState({
            tags: tags,
        });

		this.updatePostTags(tags);

    }

	updatePostTags (tags) {
		
		const { post, user, editContribution } = this.props;

		const jsonMetadata = post['json_metadata'];

		const { author, body, permlink, title, reward_weight, parent_permlink, parent_author } = post;

		const metadata = {
			...jsonMetadata,
			tags: tags
		};
		
		editContribution(
		  post.author,
		  post.permlink,
		  title,
		  body,
		  metadata
		).then((res) => {
		  console.log(res);
		});
	}

    resizeInput (input) {
        const RESIZE_FACTOR = 7.7;

        input.style.width = ((input.value.length + 1) * RESIZE_FACTOR) + 'px';
    }

    handleFocus (event) {
        this.setState({
            value: event.target.value
        });

        this.resizeInput(event.target);
    }

    handleBlur (event) {
        this.resizeInput(event.target);
    }

    handleChange (event) {
        const index = parseInt(event.target.attributes['data-index'].value, 10);

        const tags = this.state.tags.map((tag, idx) => {
            if (idx !== index) return tag;

            return { ...tag, title: event.target.value }
        });

        this.setState({
            tags: tags
        });

        this.resizeInput(event.target);

    }

    handleKeyPress (event) {
        this.resizeInput(event.target);
    }

    handleKeyUp (event) {
        this.resizeInput(event.target);
    }

    handleSubmit (event) {
        event.preventDefault();

        event.target.children[0].blur();

        const tags = this.state.tags.map((tag) => {
            return tag.title
        });

		this.updatePostTags(tags);

    }

    handleAddTagButtonClick (event) {
        this.addTag();
    }

    addTag () {

        setTimeout(() => {
            this.createNewTag();

            const input = this.getLatestInput();

            this.resizeInput(input);

            input.focus();

        }, 100);

    }

    getLatestInput () {
        const tagInputs = Array.prototype.slice.call(document.getElementsByClassName('inline-tag-edit-input'));

        return tagInputs[tagInputs.length - 1];
    }

    render () {

        const tags = this.state.tags.map((tag, index) => (
            <li className="inline-tag-edit-item" key={index}>
                <span className="inline-tag-edit">
                    <form onSubmit={this.handleSubmit}>
                        <input type="text"
                                ref="tagInput"
                                value={this.state.tags[index].title}
                                onChange={this.handleChange}
                                onFocus={this.handleFocus}
                                name={`tag-${index}`}
                                onBlur={this.handleBlur}
                                onKeyPress={this.handleKeyPress}
                                onKeyUp={this.handleKeyUp}
                                className="inline-tag-edit-input"
                                data-index={index}
                                />

                        <span className="text-right inline-tag-edit-close" data-index={index} onClick={this.onInlineTagEditClick}>&times;</span>
                    </form>
                </span>
            </li>
        ))

        return (
            <div className="inline-tag-edit-container">
                <section>
                    <ul>
                        {tags}
                    </ul>
                </section>

            </div>
        );
    }
}

export default InlineTagEdit;
