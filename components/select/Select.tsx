import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { BaseSelectProps } from './PropsType';
import Picker from '../picker';
import parseProps from '../picker-view/utils/parseProps';
import { isArray } from '../utils/validate';

export interface SelectProps extends BaseSelectProps {
  prefixCls?: string;
  className?: string;
}

export default class Select extends PureComponent<SelectProps, any> {
  static defaultProps = {
    prefixCls: 'za-select',
    valueMember: 'value',
    itemRender: data => data.label,
    cols: Infinity,
    displayRender: selected => selected.map(item => item.label),
    onClick: () => {},
  };

  private tempValue;
  private tempObjValue;
  private isScrolling;

  constructor(props) {
    super(props);
    this.state = parseProps.getSource(props);
    this.tempValue = this.state.value;
    this.tempObjValue = this.state.objValue;
  }

  componentWillReceiveProps(nextProps) {
    const state = parseProps.getSource(nextProps);
    this.tempValue = state.value;
    this.tempObjValue = state.objValue;
    this.setState(state);
  }

  handleClick = () => {
    if (this.isScrolling) {
      return false;
    }

    this.setState({
      visible: true,
    });
  }

  toggle() {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      visible: !this.state.visible,
    });
  }

  onTransition(isScrolling) {
    this.isScrolling = isScrolling;
  }

  onChange = (selected) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(selected);
    }
  }

  onOk = (selected) => {
    if (this.isScrolling) {
      return false;
    }
    // this.toggle();
    const { onOk, valueMember } = this.props;
    this.setState({
      value: selected.map(item => item[valueMember!]),
      objValue: selected,
      visible: false,
    });
    if (typeof onOk === 'function') {
      onOk(selected);
    }
  }

  // 点击取消
  onCancel = () => {
    const { onCancel } = this.props;
    this.toggle();
    this.setState({
      value: this.tempValue,
      objValue: this.tempObjValue,
    });
    if (typeof onCancel === 'function') {
      onCancel();
    }
  }

  isValueValid(value) {
    return Object.prototype.toString.call(value) === '[object String]' && !!value.trim()
    || isArray(value) && value.length > 0 && value.some(item => !!item);
  }

  render() {
    const { prefixCls, placeholder, className, disabled, displayRender, value, locale, ...others } = this.props;
    const { visible, objValue } = this.state;
    const cls = classnames(prefixCls, className, {
      [`${prefixCls}--placeholder`]: !this.isValueValid(value),
      [`${prefixCls}--disabled`]: disabled,
    });

    return (
      <div className={cls} onClick={this.handleClick}>
        <div className={`${prefixCls}__input`}>
          {this.isValueValid(value) && displayRender!(objValue || []) || placeholder || locale.placeholder}
        </div>
        <Picker
          {...others}
          visible={visible}
          value={value}
          onOk={this.onOk}
          onChange={this.onChange}
          onCancel={this.onCancel}
          onTransition={(isScrolling) => { this.onTransition(isScrolling); }}
        />
      </div>
    );
  }
}
