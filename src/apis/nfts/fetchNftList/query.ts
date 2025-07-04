import { Avatar } from '@type/avatar'
import { ApiResponse } from '@apis/axios'

type ResponseType = ApiResponse<Avatar[]>

export function fetchNftList(): Promise<ResponseType> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'success',
        data: mockData,
      })
    }, 100)
  })
}

/**
 * TODO 썸네일 이미지 URL 추가
 * TODO 머리의 경우 앞, 뒤 따로 URL 추가
 */
const mockData: ResponseType['data'] = [
  // Body Accessories 10개
  {
    id: '00001',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_1.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_1.png',
    rarity: 'common',
    name: 'body_accessory_1',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00002',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_2.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_2.png',
    rarity: 'common',
    name: 'body_accessory_2',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00003',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_3.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_3.png',
    rarity: 'common',
    name: 'body_accessory_3',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00004',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_4.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_4.png',
    rarity: 'common',
    name: 'body_accessory_4',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00005',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_5.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_5.png',
    rarity: 'common',
    name: 'body_accessory_5',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00006',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_6.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_6.png',
    rarity: 'common',
    name: 'body_accessory_6',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00007',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_7.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_7.png',
    rarity: 'common',
    name: 'body_accessory_7',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00008',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_8.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_8.png',
    rarity: 'common',
    name: 'body_accessory_8',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00009',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_9.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_9.png',
    rarity: 'common',
    name: 'body_accessory_9',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  {
    id: '00010',
    imageUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_10.png',
    thumbnailUrl: '/temp/avatar/accessories/body-accessories/nft_body_accessory_10.png',
    rarity: 'common',
    name: 'body_accessory_10',
    mainCategory: 'accessories',
    subCategory: 'body-accessories',
    link: '',
  },
  // Ear Accessories 10개
  {
    id: '00011',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_1.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_1.png',
    rarity: 'common',
    name: 'ear_accessory_1',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00012',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_2.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_2.png',
    rarity: 'common',
    name: 'ear_accessory_2',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00013',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_3.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_3.png',
    rarity: 'common',
    name: 'ear_accessory_3',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00014',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_4.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_4.png',
    rarity: 'common',
    name: 'ear_accessory_4',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00015',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_5.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_5.png',
    rarity: 'common',
    name: 'ear_accessory_5',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00016',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_6.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_6.png',
    rarity: 'common',
    name: 'ear_accessory_6',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00017',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_7.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_7.png',
    rarity: 'common',
    name: 'ear_accessory_7',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00018',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_8.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_8.png',
    rarity: 'common',
    name: 'ear_accessory_8',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00019',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_9.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_9.png',
    rarity: 'common',
    name: 'ear_accessory_9',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  {
    id: '00020',
    imageUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_10.png',
    thumbnailUrl: '/temp/avatar/accessories/ear-accessories/nft_ear_accessory_10.png',
    rarity: 'common',
    name: 'ear_accessory_10',
    mainCategory: 'accessories',
    subCategory: 'ear-accessories',
    link: '',
  },
  // Head Accessories 10개
  {
    id: '00021',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_1.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_1.png',
    rarity: 'common',
    name: 'head_accessory_1',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00022',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_2.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_2.png',
    rarity: 'common',
    name: 'head_accessory_2',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00023',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_3.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_3.png',
    rarity: 'common',
    name: 'head_accessory_3',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00024',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_4.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_4.png',
    rarity: 'common',
    name: 'head_accessory_4',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00025',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_5.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_5.png',
    rarity: 'common',
    name: 'head_accessory_5',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00026',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_6.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_6.png',
    rarity: 'common',
    name: 'head_accessory_6',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00027',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_7.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_7.png',
    rarity: 'common',
    name: 'head_accessory_7',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00028',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_8.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_8.png',
    rarity: 'common',
    name: 'head_accessory_8',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00029',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_9.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_9.png',
    rarity: 'common',
    name: 'head_accessory_9',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  {
    id: '00030',
    imageUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_10.png',
    thumbnailUrl: '/temp/avatar/accessories/head-accessories/nft_head_accessory_10.png',
    rarity: 'common',
    name: 'head_accessory_10',
    mainCategory: 'accessories',
    subCategory: 'head-accessories',
    link: '',
  },
  // Face 4개
  {
    id: '00032',
    imageUrl: '/temp/avatar/face/nft_face_2.png',
    thumbnailUrl: '/temp/avatar/face/nft_face_2.png',
    rarity: 'common',
    name: 'face_2',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  {
    id: '00033',
    imageUrl: '/temp/avatar/face/nft_face_3.png',
    thumbnailUrl: '/temp/avatar/face/nft_face_3.png',
    rarity: 'common',
    name: 'face_3',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  {
    id: '00034',
    imageUrl: '/temp/avatar/face/nft_face_4.png',
    thumbnailUrl: '/temp/avatar/face/nft_face_4.png',
    rarity: 'common',
    name: 'face_4',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  {
    id: '00035',
    imageUrl: '/temp/avatar/face/nft_face_5.png',
    thumbnailUrl: '/temp/avatar/face/nft_face_5.png',
    rarity: 'common',
    name: 'face_5',
    mainCategory: 'face',
    subCategory: null,
    link: '',
  },
  // Footwear 5개
  {
    id: '00036',
    imageUrl: '/temp/avatar/footwear/nft_footwear_1.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_1.png',
    rarity: 'common',
    name: 'footwear_1',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00037',
    imageUrl: '/temp/avatar/footwear/nft_footwear_2.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_2.png',
    rarity: 'common',
    name: 'footwear_2',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00038',
    imageUrl: '/temp/avatar/footwear/nft_footwear_3.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_3.png',
    rarity: 'common',
    name: 'footwear_3',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00039',
    imageUrl: '/temp/avatar/footwear/nft_footwear_4.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_4.png',
    rarity: 'common',
    name: 'footwear_4',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  {
    id: '00040',
    imageUrl: '/temp/avatar/footwear/nft_footwear_5.png',
    thumbnailUrl: '/temp/avatar/footwear/nft_footwear_5.png',
    rarity: 'common',
    name: 'footwear_5',
    mainCategory: 'footwear',
    subCategory: null,
    link: '',
  },
  // Lower Clothing 5개
  {
    id: '00041',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_1.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_1.png',
    rarity: 'common',
    name: 'lowerClothing_1',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00042',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_2.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_2.png',
    rarity: 'common',
    name: 'lowerClothing_2',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00043',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_3.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_3.png',
    rarity: 'common',
    name: 'lowerClothing_3',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00044',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_4.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_4.png',
    rarity: 'common',
    name: 'lowerClothing_4',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00045',
    imageUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_5.png',
    thumbnailUrl: '/temp/avatar/lowerClothing/nft_lowerClothing_5.png',
    rarity: 'common',
    name: 'lowerClothing_5',
    mainCategory: 'lowerClothing',
    subCategory: null,
    link: '',
  },
  // Skin 6개
  {
    id: '00047',
    imageUrl: '/temp/avatar/skin/nft_skin_2.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_2.png',
    rarity: 'common',
    name: 'skin_2',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  {
    id: '00048',
    imageUrl: '/temp/avatar/skin/nft_skin_3.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_3.png',
    rarity: 'common',
    name: 'skin_3',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  {
    id: '00049',
    imageUrl: '/temp/avatar/skin/nft_skin_4.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_4.png',
    rarity: 'common',
    name: 'skin_4',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  {
    id: '00050',
    imageUrl: '/temp/avatar/skin/nft_skin_5.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_5.png',
    rarity: 'common',
    name: 'skin_5',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  {
    id: '00051',
    imageUrl: '/temp/avatar/skin/nft_skin_6.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_6.png',
    rarity: 'common',
    name: 'skin_6',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  {
    id: '00052',
    imageUrl: '/temp/avatar/skin/nft_skin_7.png',
    thumbnailUrl: '/temp/avatar/skin/nft_skin_7.png',
    rarity: 'common',
    name: 'skin_7',
    mainCategory: 'skin',
    subCategory: null,
    link: '',
  },
  // Upper Clothing 5개
  {
    id: '00053',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_1.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_1.png',
    rarity: 'common',
    name: 'upperClothing_1',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00054',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_2.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_2.png',
    rarity: 'rare',
    name: 'upperClothing_2',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00055',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_3.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_3.png',
    rarity: 'epic',
    name: 'upperClothing_3',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00056',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_4.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_4.png',
    rarity: 'common',
    name: 'upperClothing_4',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  {
    id: '00057',
    imageUrl: '/temp/avatar/upperClothing/nft_upperClothing_5.png',
    thumbnailUrl: '/temp/avatar/upperClothing/nft_upperClothing_5.png',
    rarity: 'common',
    name: 'upperClothing_5',
    mainCategory: 'upperClothing',
    subCategory: null,
    link: '',
  },
  // Hair 3세트
  {
    id: '00058',
    imageUrl: ['/temp/avatar/hair/front/nft_hair_front_1.png', '/temp/avatar/hair/back/nft_hair_back_1.png'],
    thumbnailUrl: '/temp/avatar/hair/front/nft_hair_front_1.png',
    rarity: 'common',
    name: 'hair_1',
    mainCategory: 'hair',
    subCategory: null,
    link: '',
  },
  {
    id: '00059',
    imageUrl: ['/temp/avatar/hair/front/nft_hair_front_2.png', '/temp/avatar/hair/back/nft_hair_back_2.png'],
    thumbnailUrl: '/temp/avatar/hair/front/nft_hair_front_2.png',
    rarity: 'common',
    name: 'hair_2',
    mainCategory: 'hair',
    subCategory: null,
    link: '',
  },
  {
    id: '00060',
    imageUrl: ['/temp/avatar/hair/front/nft_hair_front_3.png', '/temp/avatar/hair/back/nft_hair_back_3.png'],
    thumbnailUrl: '/temp/avatar/hair/front/nft_hair_front_3.png',
    rarity: 'common',
    name: 'hair_3',
    mainCategory: 'hair',
    subCategory: null,
    link: '',
  },
]
