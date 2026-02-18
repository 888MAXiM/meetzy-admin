import { useEffect, useState } from 'react'
import { CheckCircle, Filter, XCircle } from 'react-feather'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'
import { mutations, queries } from '../../api'
import { BASE_URL } from '../../constants/url'
import { SolidButton } from '../../shared/button/SolidButton'
import { Image } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { VerificationRequest } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const VerificationRequestsTable = () => {
  const { pagination: basePagination, search, params, sort, setParams } = useTableManager({ filter: 'subscription' })
  const { data, isLoading, refetch, isRefetching } = queries.useGetVerificationRequests(params)
  const { mutate: approveVerification } = mutations.useApproveVerification()
  const { mutate: rejectVerification } = mutations.useRejectVerification()
  const { mutate } = mutations.useDeleteVerification()
  const [, setLoadingStates] = useState<Record<string, boolean>>({})
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('subscription')

  const pagination = {
    ...basePagination,
    total: data?.pagination?.total || 0,
  }

  useEffect(() => {
    setParams((prevParams) => ({
      ...prevParams,
      filter: selectedFilter || undefined,
      page: 1,
    }))
  }, [selectedFilter, setParams])

  const toggleFilterDropdown = () => setFilterDropdownOpen((prev) => !prev)

  const handleFilterSelect = (filterValue: string) => {
    setSelectedFilter(filterValue === selectedFilter ? '' : filterValue)
    setFilterDropdownOpen(false)
  }

  const isAdminGrantedFilter = selectedFilter === 'admin_granted'

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    isLoading: false,
    onConfirm: () => {},
    title: '',
    subtitle: '',
    confirmText: 'confirm',
    variant: 'default' as 'default' | 'danger' | 'warning' | 'success' | 'info',
    iconId: '',
    actionType: '' as 'approve' | 'reject' | 'delete' | '',
    requestId: '',
    rejectionReason: '',
    adminNotes: '',
  })

  const showConfirmModal = (config: Partial<typeof confirmModal>) => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: true,
      ...config,
    }))
  }

  const hideConfirmModal = () => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
      actionType: '',
      requestId: '',
      rejectionReason: '',
      adminNotes: '',
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-warning', label: 'Pending' },
      approved: { className: 'bg-success', label: 'Approved' },
      rejected: { className: 'bg-danger', label: 'Rejected' },
      payment_failed: { className: 'bg-danger', label: 'Payment Failed' },
    }

    const config = statusConfig[status] || { className: 'bg-secondary', label: status }
    return <span className={`badge ${config.className}`}>{config.label}</span>
  }

  const columns: Column<VerificationRequest>[] = [
    {
      title: 'User',
      sortable: false,
      dataField: [
        {
          field: 'user',
          renderer: (data) => (
            <div className="d-flex align-items-center gap-2">
              <div>
                <div className="fw-semibold">{data?.user?.name || 'N/A'}</div>
                <div className="text-muted small">{data?.user?.email || 'N/A'}</div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Request ID',
      sortable: true,
      sortField: 'request_id',
      dataField: [
        {
          field: 'request_id',
          renderer: (data) => <span className="font-monospace small">{data?.request_id || 'N/A'}</span>,
        },
      ],
    },
    {
      title: 'Category',
      sortable: true,
      sortField: 'category',
      dataField: [
        {
          field: 'category',
          renderer: (data) => <span className="badge bg-info text-capitalize">{data?.category || 'N/A'}</span>,
        },
      ],
    },
    {
      title: 'Document Type',
      sortable: false,
      dataField: [
        {
          field: 'document_type',
          renderer: (data) => <span className="text-capitalize">{data?.document_type || '-'}</span>,
        },
      ],
    },
    {
      title: 'Document Front',
      sortable: false,
      dataField: [
        {
          field: 'document_front_url',
          renderer: (data) => {
            if (data?.document_front_url) {
              return (
                <a
                  href={`${BASE_URL}/${data.document_front_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-block"
                  title="View Document Front"
                >
                  <Image className="text-truncate" src={data.document_front_url} width={100} height={60} />
                </a>
              )
            }
            return <span className="text-muted small">-</span>
          },
        },
      ],
    },
    {
      title: 'Document Back',
      sortable: false,
      dataField: [
        {
          field: 'document_back_url',
          renderer: (data) => {
            if (data?.document_back_url) {
              return (
                <a
                  href={`${BASE_URL}/${data.document_back_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-block"
                  title="View Document Back"
                >
                  <Image className="text-truncate" src={data.document_back_url} width={100} height={60} />
                </a>
              )
            }
            return <span className="text-muted small">-</span>
          },
        },
      ],
    },
    {
      title: 'Selfie',
      sortable: false,
      dataField: [
        {
          field: 'selfie_url',
          renderer: (data) => {
            if (data?.selfie_url) {
              return (
                <a
                  href={`${BASE_URL}/${data.selfie_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-inline-block"
                  title="View Selfie"
                >
                  <Image className="text-truncate" src={data.selfie_url} width={100} height={60} />
                </a>
              )
            }
            return <span className="text-muted small">-</span>
          },
        },
      ],
    },
    {
      title: 'Status',
      sortable: true,
      sortField: 'verification_status',
      dataField: [
        {
          field: 'verification_status',
          renderer: (data) => getStatusBadge(data?.verification_status || 'pending'),
        },
      ],
    },
    {
      title: 'Payment Status',
      sortable: false,
      dataField: [
        {
          field: 'payment',
          renderer: (data) => {
            const paymentStatus = data?.payment?.status
            const statusConfig: Record<string, { className: string; label: string }> = {
              completed: { className: 'bg-success', label: 'Completed' },
              pending: { className: 'bg-warning', label: 'Pending' },
              failed: { className: 'bg-danger', label: 'Failed' },
            }
            const config = statusConfig[paymentStatus || ''] || {
              className: 'bg-secondary',
              label: paymentStatus || 'N/A',
            }
            return <span className={`badge ${config.className}`}>{config.label}</span>
          },
        },
      ],
    },
    {
      title: 'Submitted At',
      sortable: true,
      sortField: 'submitted_at',
      dataField: [
        {
          field: 'submitted_at',
          type: COLUMN_TYPE.Date,
          dateformatOptions: { showDate: true, showTime: true },
        },
      ],
    },
  ]

  const actionsDropDown: (Action<VerificationRequest> | string)[] = [
    {
      label: 'Approve',
      actionToPerform: 'approve',
      conditional: {
        field: 'verification_status',
        condition: '===',
        conditionValue: ['pending'],
      },
      renderer: (row) => (
        <SolidButton
          className="btn-success btn-sm"
          onClick={() =>
            showConfirmModal({
              variant: 'success',
              iconId: 'check',
              title: 'Approve Verification Request',
              subtitle: `Are you sure you want to approve the verification request for ${
                row.user?.name || 'this user'
              }?`,
              confirmText: 'Approve',
              actionType: 'approve',
              requestId: row.request_id,
            })
          }
          disabled={!row.can_approve}
        >
          <CheckCircle size={16} className="me-1" />
        </SolidButton>
      ),
    },
    {
      label: 'Reject',
      actionToPerform: 'reject',
      conditional: {
        field: 'verification_status',
        condition: '===',
        conditionValue: ['pending'],
      },
      renderer: (row) => (
        <SolidButton
          className="btn-danger btn-sm"
          onClick={() =>
            showConfirmModal({
              variant: 'danger',
              iconId: 'x',
              title: 'Reject Verification Request',
              subtitle: `Are you sure you want to reject the verification request for ${
                row.user?.name || 'this user'
              }? Please provide a rejection reason.`,
              confirmText: 'Reject',
              actionType: 'reject',
              requestId: row.request_id,
            })
          }
        >
          <XCircle size={16} className="me-1" />
        </SolidButton>
      ),
    },
  ]

  const handleActionPerform = async ({
    actionToPerform,
    data,
  }: {
    actionToPerform: string
    data: VerificationRequest
  }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'approve') {
        approveVerification(
          { request_id: data.request_id },
          {
            onSuccess: () => {
              toaster('success', 'Verification request approved successfully')
              refetch()
            },
            onError: (error: any) => {
              const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve verification'
              toaster('error', errorMessage)
            },
          },
        )
      } else if (actionToPerform === 'reject') {
        // For reject, we need a rejection reason - this will be handled by the modal
        showConfirmModal({
          variant: 'danger',
          iconId: 'x',
          title: 'Reject Verification Request',
          subtitle: `Please provide a reason for rejecting the verification request for ${
            data.user?.name || 'this user'
          }.`,
          confirmText: 'Reject',
          actionType: 'reject',
          requestId: data.request_id,
        })
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleModalConfirm = () => {
    if (confirmModal.actionType === 'approve') {
      setConfirmModal((prev) => ({ ...prev, isLoading: true }))
      approveVerification(
        { request_id: confirmModal.requestId },
        {
          onSuccess: () => {
            toaster('success', 'Verification request approved successfully')
            hideConfirmModal()
            refetch()
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve verification'
            toaster('error', errorMessage)
            setConfirmModal((prev) => ({ ...prev, isLoading: false }))
          },
        },
      )
    } else if (confirmModal.actionType === 'reject') {
      if (!confirmModal.rejectionReason.trim()) {
        toaster('error', 'Please provide a rejection reason')
        return
      }
      setConfirmModal((prev) => ({ ...prev, isLoading: true }))
      rejectVerification(
        {
          request_id: confirmModal.requestId,
          rejection_reason: confirmModal.rejectionReason,
          admin_notes: confirmModal.adminNotes || undefined,
        },
        {
          onSuccess: () => {
            toaster('success', 'Verification request rejected successfully')
            hideConfirmModal()
            refetch()
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reject verification'
            toaster('error', errorMessage)
            setConfirmModal((prev) => ({ ...prev, isLoading: false }))
          },
        },
      )
    } else if (confirmModal.actionType === 'delete' && confirmModal.onConfirm) {
      confirmModal.onConfirm()
    }
  }

  const handleBulkActions = (action: string, selectedData: VerificationRequest[]) => {
    if (action === 'delete' && selectedData.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: 'Delete Verification Requests',
        subtitle: `Are you sure you want to delete ${selectedData.length} verification request(s)?`,
        confirmText: 'Delete',
        actionType: 'delete',
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedData.map((user) => String(user.id)) },
            {
              onSuccess: () => {
                toaster('success', `Successfully deleted ${selectedData.length} verification request(s)`)
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', 'Failed to delete verification request(s)')
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<VerificationRequest> = {
    columns,
    data: data?.data || [],
    actionsDropDown: isAdminGrantedFilter ? [] : actionsDropDown,
    total: data?.pagination?.total,
  }

  const getFilterLabel = (filter: string) => {
    if (!filter) return 'Filter'
    return filter === 'admin_granted' ? 'Admin Granted' : 'Subscription'
  }

  const filterDropdown = (
    <Dropdown isOpen={filterDropdownOpen} toggle={toggleFilterDropdown}>
      <DropdownToggle tag="div" className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3">
        <Filter size={16} />
        <span>{getFilterLabel(selectedFilter)}</span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem active={selectedFilter === 'admin_granted'} onClick={() => handleFilterSelect('admin_granted')}>
          Admin Granted
        </DropdownItem>
        <DropdownItem active={selectedFilter === 'subscription'} onClick={() => handleFilterSelect('subscription')}>
          Subscription
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )

  return (
    <>
      <TableWrapper
        pagination={pagination}
        search={search}
        customTopControls={filterDropdown}
        showDelete={true}
        handleBulkActions={handleBulkActions}
      >
        <CommonTable
          isLoading={isLoading}
          isRefetching={isLoading || isRefetching}
          tableConfiguration={config}
          onActionPerform={handleActionPerform}
          sort={sort}
        />
      </TableWrapper>

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.actionType === 'approve'}
        onClose={hideConfirmModal}
        onConfirm={handleModalConfirm}
        isLoading={confirmModal.isLoading}
        variant={confirmModal.variant}
        title={confirmModal.title}
        subtitle={confirmModal.subtitle}
        confirmText={confirmModal.confirmText}
        loadingText="Processing..."
        iconId={confirmModal.iconId}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.actionType === 'delete'}
        onClose={hideConfirmModal}
        onConfirm={handleModalConfirm}
        isLoading={confirmModal.isLoading}
        variant={confirmModal.variant}
        title={confirmModal.title}
        subtitle={confirmModal.subtitle}
        confirmText={confirmModal.confirmText}
        loadingText="Deleting..."
        iconId={confirmModal.iconId}
      />

      <Modal isOpen={confirmModal.isOpen && confirmModal.actionType === 'reject'} toggle={hideConfirmModal} centered>
        <ModalHeader toggle={hideConfirmModal}>Reject Verification Request</ModalHeader>
        <ModalBody>
          <p className="mb-3">
            Are you sure you want to reject the verification request? Please provide a reason for rejection.
          </p>
          <FormGroup>
            <Label for="rejection-reason" className="fw-semibold">
              Rejection Reason <span className="text-danger">*</span>
            </Label>
            <Input
              id="rejection-reason"
              type="textarea"
              rows={4}
              value={confirmModal.rejectionReason}
              onChange={(e) => setConfirmModal((prev) => ({ ...prev, rejectionReason: e.target.value }))}
              placeholder="Enter the reason for rejecting this verification request..."
            />
          </FormGroup>
          <FormGroup>
            <Label for="admin-notes">Admin Notes (Optional)</Label>
            <Input
              id="admin-notes"
              type="textarea"
              rows={2}
              value={confirmModal.adminNotes}
              onChange={(e) => setConfirmModal((prev) => ({ ...prev, adminNotes: e.target.value }))}
              placeholder="Add any additional notes..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <SolidButton
            color="secondary"
            className="btn-bg-secondary"
            onClick={hideConfirmModal}
            disabled={confirmModal.isLoading}
          >
            Cancel
          </SolidButton>
          <SolidButton
            color="danger"
            className="btn-bg-danger"
            onClick={handleModalConfirm}
            disabled={confirmModal.isLoading || !confirmModal.rejectionReason.trim()}
          >
            {confirmModal.isLoading ? 'Rejecting...' : 'Reject'}
          </SolidButton>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default VerificationRequestsTable
