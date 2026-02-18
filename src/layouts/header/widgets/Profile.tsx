import { LogIn } from 'react-feather'
import { Link } from 'react-router-dom'
import { queries } from '../../../api'
import { Href } from '../../../constants'
import { ProfileHeaderData } from '../../../data/layout/Header'
import { useAppDispatch } from '../../../redux/hooks'
import { logout } from '../../../redux/reducers/authSlice'
import { Avatar } from '../../../shared/image'
import { ConfirmModal } from '../../../shared/modal'
import { useState } from 'react'

const Profile = () => {
  const { data } = queries.useGetUserDetails()
  const [open, setOpen] = useState(false)

  const confirmLogout = () => {
    dispatch(logout())
    setOpen(false)
  }

  const dispatch = useAppDispatch()
  return (
    <>
      <li className="profile-nav onhover-dropdown pe-0 py-0">
        <div className="d-flex align-items-center profile-media">
          <Avatar data={{ avatar: data?.user?.avatar || null }} name={{ name: data?.user?.name }} />
          <div className="flex-grow-1">
            <span>{data?.user?.name}</span>
            <p className="mb-0">
              admin <i className="middle fa fa-angle-down"></i>
            </p>
          </div>
        </div>

        <ul className="profile-dropdown onhover-show-div">
          {ProfileHeaderData.map((item) => (
            <li key={item.id}>
              <Link to={item.link}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link to={Href} onClick={() => setOpen((pre) => !pre)}>
              <span>
                <LogIn />
              </span>
              <span>Log out</span>
            </Link>
          </li>
        </ul>
      </li>
      <ConfirmModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        onConfirm={confirmLogout}
        title="Logout"
        subtitle={`Are you sure you want to logout?`}
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
        showIcon={true}
        iconId="logout"
      />
    </>
  )
}

export default Profile
