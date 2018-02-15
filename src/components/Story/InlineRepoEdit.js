import React, { Component } from 'react';
import { Icon } from 'antd';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';

import getStore from '../../store';

import { broadcastComment } from '../../post/Write/editorActions';

import { getGithubRepos, setGithubRepos } from '../../actions/projects';


@connect(
  state => ({
    repos: state.repos,
  }),
  { getGithubRepos,
    setGithubRepos
  },
)


class InlineRepoEdit extends React.Component {

    state = {
        value: this.props.value,
        loading: false,
        loaded: true
    }

    constructor (props) {
        super(props);
        this.renderItems = this.renderItems.bind(this);
        this.onInlineRepoEditKeyPress = this.onInlineRepoEditKeyPress.bind(this);
        this.post = props.post
    }

    renderItems(items) {
      return items;
    }

    onInlineRepoEditKeyPress(event) {
        let q = event.target.value;
        q = q.replace('https://', '');
        q = q.replace('http://', '');
        q = q.replace('github.com/', '');
        q = '"' + q + '"';

        if (event.key === 'Enter') {
          event.preventDefault();

          this.setState({loading: true, loaded: false});

          this.search.refs.input.click();

          getGithubRepos({
            q,
        })(getStore().dispatch).then((repo) => {
            this.setState({loaded: true, loading: false});
            this.search.refs.input.click();

            });
        }

    }

    onInlineRepoEditSelect(value, repo) {
        this.setState({
            value: repo.full_name
        });

        const jsonMetadata = this.post['json_metadata'];

        const metadata = {
            ...jsonMetadata,
            repository: repo
        };

        const { author, body, permlink, title, reward_weight, parent_permlink, parent_author } = this.post;

        broadcastComment(
          parent_author,
          parent_permlink,
          author,
          title,
          body,
          metadata,
          permlink,
          reward_weight
        );

    }


    render () {
        const { repos } = this.props;

        return (
            <Autocomplete
              ref={ search => this.search = search }
              value={ this.state.value }
              inputProps={{
                id: 'inline-edit',
                placeholder: 'Browse Github repositories',
                className: `inline-repo-edit`,
                onKeyPress: (event) => this.onInlineRepoEditKeyPress(event)
            }}
              items={ repos }
              onSelect={(value, repo) => this.onInlineRepoEditSelect(value, repo)}
              getItemValue={repo => repo.full_name}
              onChange={(event, value) => {
                this.setState({value});

                if (value === '') {
                  this.setState({loaded: false});
                }

              }}
              renderItem={(repo, isHighlighted) => (
                <div
                  className='Topnav__search-item'
                  key={repo.full_name}
                >
                  <span><Icon type='github' /> <b>{repo.full_name}</b></span>
                  <span>{repo.html_url}</span>
                </div>
              )}
              renderMenu={(items, value) => (
                <div className="Topnav__search-menu-reg inline-repo-edit-menu">
                  <div>
                    {items.length === 0 && !this.state.loaded && !this.state.loading && <div className="Topnav__search-tip"><b>Press enter to see results</b></div>}
                    {items.length === 0 && this.state.loaded && <div className="Topnav__search-tip">No projects found</div>}
                    {this.state.loading && <div className="Topnav__search-tip">Loading...</div>}
                    {items.length > 0 && this.renderItems(items)}
                  </div>
                </div>
              )}

            />

        );
    }
}

export default InlineRepoEdit;
