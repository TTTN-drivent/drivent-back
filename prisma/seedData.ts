import { Hotel, Room, TicketType } from "@prisma/client";
import dayjs from "dayjs";

export const eventData = {
  title: "Driven.t",
  logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
  backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
  startsAt: dayjs().toDate(),
  endsAt: dayjs().add(21, "days").toDate(),
}

export const ticketTypesData = [{
  name: "Online",
  price: 10000,
  isRemote: true,
  includesHotel: false
},
{
  name: "Sem Hotel",
  price: 25000,
  isRemote: false,
  includesHotel: false
},
{
  name: "Com Hotel",
  price: 60000,
  isRemote: false,
  includesHotel: true
}] as TicketType[]

export const HotelsData = [{
  name: 'Hotel Driven',
  image: 'https://blog.maxmilhas.com.br/wp-content/uploads/2016/01/pr%C3%A9dio-de-hotel.jpg'
},
{
  name: 'Driven Resort',
  image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg'
},
{
  name: 'Hotel Alonis',
  image: 'https://www.hotelpremiumcampinas.com.br/wp-content/uploads/2021/08/fachada-scaled.jpg'
}] as Hotel[];

export const RoomsFirstHotelData = [{
  name: '101',
  capacity: 1
},
{
  name: '102',
  capacity: 1
},
{
  name: '103',
  capacity: 1
},
{
  name: '104',
  capacity: 1
},
{
  name: '201',
  capacity: 2
},
{
  name: '202',
  capacity: 2
},
{
  name: '203',
  capacity: 2
},
{
  name: '204',
  capacity: 2
},
{
  name: '301',
  capacity: 3
},
{
  name: '302',
  capacity: 3
},
{
  name: '303',
  capacity: 3
},
{
  name: '304',
  capacity: 3
}] as Room[]

export const RoomsSecondHotelData = [{
  name: '001',
  capacity: 2
},
{
  name: '002',
  capacity: 2
},
{
  name: '003',
  capacity: 2
},
{
  name: '011',
  capacity: 3
},
{
  name: '012',
  capacity: 3
},
{
  name: '013',
  capacity: 3
}] as Room[]

export const RoomsThirdHotelData = [{
  name: '1001',
  capacity: 3
},
{
  name: '1002',
  capacity: 3
},
{
  name: '1003',
  capacity: 3
},
{
  name: '1011',
  capacity: 3
},
{
  name: '1012',
  capacity: 3
},
{
  name: '1013',
  capacity: 3
},
{
  name: '1021',
  capacity: 3
},
{
  name: '1022',
  capacity: 3
},
{
  name: '1023',
  capacity: 3
},
{
  name: '1031',
  capacity: 3
},
{
  name: '1032',
  capacity: 3
},
{
  name: '1033',
  capacity: 3
},
{
  name: '1041',
  capacity: 3
},
{
  name: '1042',
  capacity: 3
},
{
  name: '1043',
  capacity: 3
},
] as Room[]

export const activityLocalData = [
  {
    name: ''
  },
  {
    name: ''
  },
  {
    name: ''
  },
]
