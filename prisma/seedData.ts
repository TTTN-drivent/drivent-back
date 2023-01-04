import { Activity, ActivityDate, ActivityLocal, Hotel, Room, TicketType } from "@prisma/client";
import dayjs from "dayjs";

const today = dayjs(dayjs()).format('YYYY-MM-DD');
const firstDay = dayjs(today).add(19, "days").format('YYYY-MM-DD');
const secondDay = dayjs(today).add(20, "days").format('YYYY-MM-DD');
const thirdDay = dayjs(today).add(21, "days").format('YYYY-MM-DD');

export const eventData = {
  title: "Driven.t",
  logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
  backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
  startsAt: dayjs(today).toDate(),
  endsAt: dayjs(thirdDay).toDate(),
};

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
}] as TicketType[];

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
}] as Room[];

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
}] as Room[];

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
] as Room[];

export const activityLocalData = [
  {
    name: 'Auditório Principal'
  },
  {
    name: 'Auditório Lateral'
  },
  {
    name: 'Sala de Workshop'
  }] as ActivityLocal[];

export const activityDateData = [
  {
    date: dayjs(firstDay).toDate(),
  },
  {
    date: dayjs(secondDay).toDate(),
  },
  {
    date: dayjs(thirdDay).toDate(),
  }] as ActivityDate[];

export const firstActivityData = [
  {
    name: 'Minecraft: montando o PC ideal',
    capacity: 27,
    startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'LoL: montando o PC ideal',
    capacity: 0,
    startAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra x',
    capacity: 27,
    startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra y',
    capacity: 27,
    startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra z',
    capacity: 0,
    startAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate()
  }] as Activity[]

export const secondActivityData = [
  {
    name: 'Minecraft: montando o PC ideal',
    capacity: 52,
    startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'LoL: montando o PC ideal',
    capacity: 0,
    startAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra x',
    capacity: 27,
    startAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:30`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra y',
    capacity: 27,
    startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 10:30`, 'YYYY-MM-DD HH:mm').toDate()
  },
  {
    name: 'Palestra z',
    capacity: 0,
    startAt: dayjs(`${firstDay} 10:30`, 'YYYY-MM-DD HH:mm').toDate(),
    endAt: dayjs(`${firstDay} 11:30`, 'YYYY-MM-DD HH:mm').toDate()
  }] as Activity[]

export const thirdActivityData = [{
  name: 'Palestra x',
  capacity: 27,
  startAt: dayjs(`${firstDay} 09:00`, 'YYYY-MM-DD HH:mm').toDate(),
  endAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate()
},
{
  name: 'Coffee Break',
  capacity: 27,
  startAt: dayjs(`${firstDay} 10:00`, 'YYYY-MM-DD HH:mm').toDate(),
  endAt: dayjs(`${firstDay} 10:20`, 'YYYY-MM-DD HH:mm').toDate()
},
{
  name: 'Palestra Final',
  capacity: 100,
  startAt: dayjs(`${firstDay} 10:20`, 'YYYY-MM-DD HH:mm').toDate(),
  endAt: dayjs(`${firstDay} 11:00`, 'YYYY-MM-DD HH:mm').toDate()
}] as Activity[]
