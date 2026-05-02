import { create } from 'zustand'

type Permission = {
  isGeolocationPermissionGranted: boolean
  setIsGeolocationPermissionGranted: (isGeolocationPermissionGranted: boolean) => void
}

export const usePermissionStore = create<Permission>()((set) => ({
  isGeolocationPermissionGranted: false,
  setIsGeolocationPermissionGranted: (isGeolocationPermissionGranted: boolean) =>
    set(() => ({ isGeolocationPermissionGranted })),
}))
