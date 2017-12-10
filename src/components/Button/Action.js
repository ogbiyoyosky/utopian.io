import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, loading, disabled, primary, compact, cozy, style, small, onClick, id, negative, positive, deepblue}) => (
  <button id={id} disabled={disabled} style={style} className={classNames('Action', { 'ant-btn-lg': !small, 'Action--primary': primary, 'Action--negative': negative, 'Action--positive': positive, 'Action--compact': compact, 'Action--cozy': cozy, 'Action--deepblue': deepblue, })} onClick={onClick}>
    {loading && <Icon type="loading" />}
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
  style: PropTypes.shape(),
  small: PropTypes.bool,
  onClick: PropTypes.func,
  negative: PropTypes.bool,
  positive: PropTypes.bool,
  deepblue: PropTypes.bool,
};

Action.defaultProps = {
  loading: false,
  disabled: false,
  primary: false,
  style: {},
  small: false,
  onClick: () => {},
  negative: false,
  positive: false,
  deepblue: false,
};

export default Action;
