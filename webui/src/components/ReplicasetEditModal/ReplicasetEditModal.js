import * as R from 'ramda';
import PropTypes from 'prop-types';
import React from 'react';
import { defaultMemoize } from 'reselect';
import {css} from 'react-emotion';

import CommonItemEditModal from 'src/components/CommonItemEditModal';

import './ReplicasetEditModal.css';

const styles = {
  uriLabel: css`
    color: #838383;
  `,
  serverLabel: css`
    font-size: 14px;
    color: #343434;
    font-family: Roboto;
  `,
  dragIcon: css`
    width: 100%;
    cursor: move!important;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: lightgrey;
    font-size: 20px;
  `,
  tableStyles: css`
    margin-left: 0px
  `
};


const isStorageWeightInputDisabled = formData => ! formData.roles.includes('vshard-storage');
const isStorageWeightInputValueValid = formData => {
  // return /^[0-9]*(\.[0-9]+)?$/.test(formData.weight.trim());
  const number = Number(formData.weight);
  return number >= 0 && number < Infinity;
};

const renderSelectOptions = record => record.servers.map(server => ({
  key: server.uuid,
  label: <span className={styles.serverLabel}>
            {server.alias || 'No alias'}{' '}
    <span className={styles.uriLabel}>{server.uri}</span>
          </span>,
}));

const renderDraggableListOptions = record => record.servers.map(server => ({
  key: server.uuid,
  label: <span className={styles.serverLabel}>
            {server.alias || 'No alias'}{' '}
    <span className={styles.uriLabel}>{server.uri}</span>
          </span>,
}));

const prepareFields = (roles, replicaset) => {
  const rolesOptions = roles.map(role => ({ key: role, label: role }));

  const shallRenderDraggableList = replicaset && replicaset.servers.length > 2;

  const draggableListCustomProps = {};

  if (!shallRenderDraggableList) {
    draggableListCustomProps.create = {
      hidden: true,
    };
  } else {
    draggableListCustomProps.create = {
      tableProps: {
        showHeader: false,
        className: styles.tableStyles,
        rowKey: 'uuid',
      },
      tableColumns: [
        {
          title: 'Operates',
          key: 'operate',
          render: () => <a className={styles.dragIcon}>☰</a>,
        },

        {
          title: 'Альяс',
          dataIndex: 'alias',
        },
        {
          title: 'Адрес',
          dataIndex: 'uri',
        },
      ],
      tableData: R.pipe(
          R.map(R.pick(['alias', 'uri', 'uuid'])),
          R.map((data) => ({ ...data, key: data.uuid })),
      )(replicaset.servers)
    };
    draggableListCustomProps.edit = draggableListCustomProps.create;
  }

  return [
    {
      key: 'uuid',
      hidden: true,
    },
    {
      key: 'roles',
      title: 'Roles',
      type: 'checkboxGroup',
      options: rolesOptions,
    },
    {
      key: 'weight',
      title: 'Weight',
      type: 'input',
      disabled: isStorageWeightInputDisabled,
      customProps: {
        create: {
          hidden: true,
        },
      },
      invalid: dataSource => {
        return ! isStorageWeightInputDisabled(dataSource)
          && dataSource.weight != null
          && dataSource.weight.trim() !== ''
          && ! isStorageWeightInputValueValid(dataSource);
      },
      invalidFeedback: 'Field accepts number, ex: 1.2',
    },
    {
      key: 'master',
      title: shallRenderDraggableList ? 'Priority' : 'Master',
      type: shallRenderDraggableList ? 'draggableList' : 'optionGroup',
      options: shallRenderDraggableList ? renderDraggableListOptions : renderSelectOptions,
      customProps: draggableListCustomProps,
    },

  ];
};

const defaultDataSource =  {
  uuid: null,
  roles: [],
  weight: '',
  master: null,
  servers: [],
};

const prepareDataSource = replicaset => {
  return {
    ...replicaset,
    weight: replicaset.weight != null ? String(replicaset.weight) : '',
    master: replicaset.master.uuid,
  };
};

class ReplicasetEditModal extends React.PureComponent {
  render() {
    const { isLoading, isSaving, replicasetNotFound, shouldCreateReplicaset, submitStatusMessage, onSubmit,
      onRequestClose } = this.props;

    const dataSource = isLoading || replicasetNotFound
      ? null
      : shouldCreateReplicaset ? defaultDataSource : this.getDataSource();
    const fields = this.getFields();

    return (
      <CommonItemEditModal
        title={['Create replica set', 'Edit replica set']}
        isLoading={isLoading}
        isSaving={isSaving}
        itemNotFound={replicasetNotFound}
        shouldCreateItem={shouldCreateReplicaset}
        fields={fields}
        dataSource={dataSource}
        isFormReadyToSubmit={this.isFormReadyToSubmit}
        submitStatusMessage={submitStatusMessage}
        onSubmit={onSubmit}
        onRequestClose={onRequestClose} />
    );
  }

  isFormReadyToSubmit = formData => {
    if ( ! isStorageWeightInputDisabled(formData)) {
      return isStorageWeightInputValueValid(formData);
    }
    return true;
  };

  getFields = () => {
    const { knownRoles, replicaset } = this.props;
    return this.prepareFields(knownRoles, replicaset);
  };

  getDataSource = () => {
    const { replicaset } = this.props;
    return this.prepareDataSource(replicaset);
  };

  prepareFields = defaultMemoize(prepareFields);

  prepareDataSource = defaultMemoize(prepareDataSource);
}

ReplicasetEditModal.propTypes = {
  isLoading: PropTypes.bool,
  isSaving: PropTypes.bool,
  replicasetNotFound: PropTypes.bool,
  shouldCreateReplicaset: PropTypes.bool,
  knownRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  replicaset: PropTypes.shape({
    uuid: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  submitStatusMessage: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

ReplicasetEditModal.defaultProps = {
  isLoading: false,
  isSaving: false,
  replicasetNotFound: false,
  shouldCreateReplicaset: false,
};

export default ReplicasetEditModal;