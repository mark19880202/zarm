import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { BaseModalHeaderProps } from './PropsType';
import Icon from '../icon';

export interface ModalHeaderProps extends BaseModalHeaderProps {
  prefixCls?: string;
  className?: string;
}

export default class ModalHeader extends PureComponent<ModalHeaderProps, {}> {
  static defaultProps = {
    prefixCls: 'za-modal',
    title: '',
  };

  render() {
    const { prefixCls, className, title, onClose, ...others } = this.props;
    const cls = classnames(`${prefixCls}__header`, className);
    const btnClose = onClose && <Icon type="wrong" className={`${prefixCls}__header__close`} onClick={onClose} />;

    return (
      <div className={cls} {...others}>
        <div className={`${prefixCls}__header__title`}>{title}</div>
        {btnClose}
      </div>
    );
  }
}
