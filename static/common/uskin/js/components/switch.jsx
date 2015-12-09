import React from 'react';
import hash from '../mixins/hash';
import styles from '../mixins/styles';

class Switch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      id: hash()
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    var props = this.props;
    this.setState({
      checked: props.checked ? true : false,
      disabled: props.disabled ? true : false
    });
  }

  onChange(e) {
    var checked = !this.state.checked;
    this.setState({
      checked: checked
    });
    this.props.onChange && this.props.onChange.apply(this, [e, checked]);
  }

  render() {
    var props = this.props,
      state = this.state;

    var style = styles.getWidth(props.width);

    return (
      <div className="switch" style={style}>
        <input type="checkbox" id={state.id} checked={state.checked}
          onChange={state.disabled ? undefined : this.onChange} />
        <label htmlFor={state.id} className="switch-inner">
          {state.checked ? props.labelOn : props.labelOff}
        </label>
      </div>
    );
  }
}

export default Switch;