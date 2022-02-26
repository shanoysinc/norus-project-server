import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

const symptoms = [
  "Check in with Doctor",
  "Dizzy",
  "Runny nose",
  "fast heart rate",
  "fever",
  "chest pain",
  "covid-19",
  "common cold",
  "sinus",
];

const getSymptom = (symptoms) => {
  return symptoms[Math.floor(Math.random() * symptoms.length)];
};

const getId = faker.datatype.uuid;
const getFirstName = faker.name.firstName;
const getLastName = faker.name.lastName;
const getEmail = faker.internet.email;
const getPassword = faker.internet.password;
const getAddress = faker.address.country;
const getOccupation = faker.name.jobTitle;
const getGender = faker.name.gender;
const getPhoneNumber = faker.phone.phoneNumber;
const getAge = () => faker.datatype.number({ min: 0, max: 120 });

//get date between now and 1 year in the future
const getDate = faker.date.between(new Date(), faker.date.future(1));

export function buildReq(overrides) {
  const req = { body: {}, params: {}, ...overrides };
  return req;
}

export function buildRes(overrides) {
  const res = {
    json: jest.fn(() => res).mockName("json"),
    send: jest.fn(() => res).mockName("send"),
    status: jest.fn(() => res).mockName("status"),
    ...overrides,
  };
  return res;
}

export function buildNext(impl) {
  return jest.fn(impl).mockName("next");
}

export function BuildDoctor(overrides) {
  return {
    _id: getId(),
    firstName: getFirstName(),
    lastName: getLastName(),
    email: getEmail(),
    password: getPassword(),
    patients: [],
    appointments: [],
    ...overrides,
  };
}
export function BuildPatient(overrides) {
  return {
    _id: getId(),
    firstName: getFirstName(),
    lastName: getLastName(),
    email: getEmail(),
    occupation: getOccupation(),
    age: getAge(),
    gender: getGender(),
    address: getAddress(),
    height: "5f6",
    phoneNumber: getPhoneNumber().toString(),
    weight: "68kgs",
    password: getPassword(),
    doctor: "",
    ...overrides,
  };
}

export function buildAppointment(overrides) {
  return {
    _id: getId(),
    symptom: getSymptom(symptoms),
    date: getDate(),
    time: getDate(),
    doctor: "",
    patient: "",
    ...overrides,
  };
}
