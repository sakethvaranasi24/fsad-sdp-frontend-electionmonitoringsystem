import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitizenPortal.css';

function CitizenPortal({ onLogout }) {
  const navigate = useNavigate();

  const getInitialRegisterForm = () => ({
    fullName: '',
    parentName: '',
    dob: '',
    gender: '',
    aadhaar: '',
    mobile: '',
    email: '',
    houseNumber: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pin: '',
    constituency: '',
    declaration: false
  });
  const [activeTab, setActiveTab] = useState('elections');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [pollingStation, setPollingStation] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [submittedReports, setSubmittedReports] = useState([]);
  const [registerForm, setRegisterForm] = useState(getInitialRegisterForm());
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerMessage, setRegisterMessage] = useState('');
  const [registerVoterId, setRegisterVoterId] = useState('');

  const [violationType, setViolationType] = useState('');
  const [violationLocation, setViolationLocation] = useState('');
  const [violationDescription, setViolationDescription] = useState('');
  const [violationImage, setViolationImage] = useState(null);
  const [violationImagePreview, setViolationImagePreview] = useState(null);
  const [submittedComplaints, setSubmittedComplaints] = useState([]);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('details');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    aadhaar: '1234 5678 9012',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    newPassword: '',
    confirmPassword: ''
  });

  const [userLocation, setUserLocation] = useState({
    country: 'india',
    state: '',
    district: ''
  });

  const [selectedPollingDistrict, setSelectedPollingDistrict] = useState('');
  const [selectedMapStation, setSelectedMapStation] = useState(null);
  const [selectedPollingState, setSelectedPollingState] = useState('');

  const locationData = {
    india: {
      states: ['maharashtra', 'karnataka', 'delhi', 'tamil-nadu', 'uttar-pradesh', 'rajasthan', 'gujarat', 'west-bengal', 'madhya-pradesh', 'punjab', 'haryana', 'kerala', 'andhra-pradesh', 'telangana', 'bihar', 'odisha', 'assam', 'jharkhand'],
      stateNames: {
        maharashtra: 'Maharashtra',
        karnataka: 'Karnataka',
        delhi: 'Delhi',
        'tamil-nadu': 'Tamil Nadu',
        'uttar-pradesh': 'Uttar Pradesh',
        rajasthan: 'Rajasthan',
        gujarat: 'Gujarat',
        'west-bengal': 'West Bengal',
        'madhya-pradesh': 'Madhya Pradesh',
        punjab: 'Punjab',
        haryana: 'Haryana',
        kerala: 'Kerala',
        'andhra-pradesh': 'Andhra Pradesh',
        telangana: 'Telangana',
        bihar: 'Bihar',
        odisha: 'Odisha',
        assam: 'Assam',
        jharkhand: 'Jharkhand'
      },
      districts: {
        maharashtra: ['mumbai', 'pune', 'nagpur', 'nashik', 'thane', 'aurangabad', 'solapur', 'satara', 'kolhapur', 'ratnagiri', 'sindhudurg', 'sangli', 'latur', 'usmanabad', 'buldhana', 'akola'],
        karnataka: ['bangalore', 'belgaum', 'mysore', 'kumta', 'hassan', 'mangalore', 'hubli', 'bijapur', 'dharwad', 'shimoga', 'davangere', 'kolar', 'tumkur', 'chickmagalur'],
        delhi: ['north', 'central', 'south', 'east', 'west', 'new-delhi', 'north-west', 'north-east', 'south-east', 'west-delhi'],
        'tamil-nadu': ['chennai', 'madurai', 'salem', 'coimbatore', 'tiruppur', 'tiruchirappalli', 'erode', 'vellore', 'ranipet', 'kanchipuram', 'villupuram', 'cuddalore', 'nagercoil', 'tirunelveli', 'kanniyakumari'],
        'uttar-pradesh': ['lucknow', 'kanpur', 'varanasi', 'agra', 'meerut', 'allahabad', 'ghaziabad', 'bareilly', 'mathura', 'firozabad', 'azamgarh', 'gorakhpur', 'saharanpur', 'bijnor', 'moradabad'],
        rajasthan: ['jaipur', 'udaipur', 'jodhpur', 'bikaner', 'ajmer', 'kota', 'alwar', 'kintoor', 'jhunjhunu', 'sikar', 'churu', 'hanumangarh', 'sriganganagar', 'barmer', 'jaisalmer'],
        gujarat: ['ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar', 'jamnagar', 'gandhinagar', 'yavatmal', 'junagadh', 'patan', 'amreli', 'valsad', 'navsari', 'porbandar', 'kutch'],
        'west-bengal': ['kolkata', 'howrah', 'darjeeling', 'murshidabad', 'nadia', 'north-24-parganas', 'south-24-parganas', 'jalpaiguri', 'cooch-behar', 'siliguri', 'malda', 'western-dinajpur', 'eastern-dinajpur', 'bankura', 'birbhum'],
        'madhya-pradesh': ['bhopal', 'indore', 'gwalior', 'jabalpur', 'ujjain', 'sagar', 'rewa', 'dindori', 'seoni', 'sidhi', 'tikamgarh', 'datia', 'raisen', 'vidisha', 'hoshangabad'],
        punjab: ['ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda', 'mohali', 'hoshiarpur', 'gurdaspur', 'tarn-taran', 'kapurthala', 'mansa', 'sangrur', 'ferozepur', 'firozpur'],
        haryana: ['gurgaon', 'faridabad', 'rohtak', 'panipat', 'ambala', 'hisar', 'karnal', 'yamunanagar', 'panchkula', 'sonipat', 'ellenabad', 'mahendragarh', 'nuh', 'palwal'],
        kerala: ['thiruvananthapuram', 'kochi', 'kozhikode', 'kollam', 'thrissur', 'palakkad', 'kannur', 'idukki', 'alappuzha', 'pathanamthitta', 'malappuram', 'ernakulam', 'kottayam', 'wayanad'],
        'andhra-pradesh': ['visakhapatnam', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'tirupati', 'rajahmundry', 'anantapur', 'chittoor', 'kadapa', 'prakasam', 'srikakulam', 'east-godavari', 'west-godavari', 'krishna', 'spsr-nellore'],
        telangana: ['hyderabad', 'warangal', 'nizamabad', 'karimnagar', 'khammam', 'nalgonda', 'rangareddy', 'adilabad', 'mahabubnagar', 'medak', 'sangareddy', 'mancherial', 'kamareddy', 'siddipet', 'vikarabad', 'secunderabad', 'tandur'],
        bihar: ['patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'darbhanga', 'purnia', 'araria', 'east-champaran', 'west-champaran', 'sitamarhi', 'madhubani', 'saharsa', 'khagaria', 'buxar', 'vaishali'],
        odisha: ['bhubaneswar', 'cuttack', 'puri', 'rourkela', 'sambalpur', 'berhampur', 'balasore', 'bhadrak', 'dhenkanal', 'angul', 'jajpur', 'kendrapara', 'malkangiri', 'koraput', 'bargarh'],
        assam: ['guwahati', 'dibrugarh', 'jorhat', 'silchar', 'nagaon', 'tezpur', 'tinsukia', 'kamrup', 'barpeta', 'dhubri', 'goalpara', 'lakhimpur', 'sonitpur', 'cachar', 'dima-hasao'],
        jharkhand: ['ranchi', 'jamshedpur', 'dhanbad', 'bokaro', 'hazaribagh', 'giridih', 'deoghar', 'singhbhum', 'dumka', 'godda', 'sahibganj', 'pakur', 'kolhan', 'ramgarh']
      },
      districtNames: {
        // Maharashtra
        mumbai: 'Mumbai',
        pune: 'Pune',
        nagpur: 'Nagpur',
        nashik: 'Nashik',
        thane: 'Thane',
        aurangabad: 'Aurangabad',
        solapur: 'Solapur',
        // Karnataka
        bangalore: 'Bangalore',
        belgaum: 'Belgaum',
        mysore: 'Mysore',
        kumta: 'Kumta',
        hassan: 'Hassan',
        mangalore: 'Mangalore',
        hubli: 'Hubli',
        // Delhi
        'new-delhi': 'New Delhi',
        'north-west': 'North West Delhi',
        // Tamil Nadu
        chennai: 'Chennai',
        madurai: 'Madurai',
        salem: 'Salem',
        coimbatore: 'Coimbatore',
        tiruppur: 'Tiruppur',
        tiruchirappalli: 'Tiruchirappalli',
        erode: 'Erode',
        // Uttar Pradesh
        lucknow: 'Lucknow',
        kanpur: 'Kanpur',
        varanasi: 'Varanasi',
        agra: 'Agra',
        meerut: 'Meerut',
        allahabad: 'Allahabad',
        ghaziabad: 'Ghaziabad',
        // Rajasthan
        jaipur: 'Jaipur',
        udaipur: 'Udaipur',
        jodhpur: 'Jodhpur',
        bikaner: 'Bikaner',
        ajmer: 'Ajmer',
        kota: 'Kota',
        alwar: 'Alwar',
        // Gujarat
        ahmedabad: 'Ahmedabad',
        surat: 'Surat',
        vadodara: 'Vadodara',
        rajkot: 'Rajkot',
        bhavnagar: 'Bhavnagar',
        jamnagar: 'Jamnagar',
        gandhinagar: 'Gandhinagar',
        // West Bengal
        kolkata: 'Kolkata',
        howrah: 'Howrah',
        darjeeling: 'Darjeeling',
        murshidabad: 'Murshidabad',
        nadia: 'Nadia',
        'north-24-parganas': 'North 24 Parganas',
        'south-24-parganas': 'South 24 Parganas',
        // Madhya Pradesh
        bhopal: 'Bhopal',
        indore: 'Indore',
        gwalior: 'Gwalior',
        jabalpur: 'Jabalpur',
        ujjain: 'Ujjain',
        sagar: 'Sagar',
        rewa: 'Rewa',
        // Punjab
        ludhiana: 'Ludhiana',
        amritsar: 'Amritsar',
        jalandhar: 'Jalandhar',
        patiala: 'Patiala',
        bathinda: 'Bathinda',
        mohali: 'Mohali',
        hoshiarpur: 'Hoshiarpur',
        // Haryana
        gurgaon: 'Gurgaon',
        faridabad: 'Faridabad',
        rohtak: 'Rohtak',
        panipat: 'Panipat',
        ambala: 'Ambala',
        hisar: 'Hisar',
        karnal: 'Karnal',
        // Kerala
        thiruvananthapuram: 'Thiruvananthapuram',
        kochi: 'Kochi',
        kozhikode: 'Kozhikode',
        kollam: 'Kollam',
        thrissur: 'Thrissur',
        palakkad: 'Palakkad',
        kannur: 'Kannur',
        // Andhra Pradesh
        visakhapatnam: 'Visakhapatnam',
        vijayawada: 'Vijayawada',
        guntur: 'Guntur',
        nellore: 'Nellore',
        kurnool: 'Kurnool',
        tirupati: 'Tirupati',
        rajahmundry: 'Rajahmundry',
        anantapur: 'Anantapur',
        chittoor: 'Chittoor',
        kadapa: 'Kadapa',
        prakasam: 'Prakasam',
        srikakulam: 'Srikakulam',
        'east-godavari': 'East Godavari',
        'west-godavari': 'West Godavari',
        krishna: 'Krishna',
        // Telangana
        hyderabad: 'Hyderabad',
        warangal: 'Warangal',
        nizamabad: 'Nizamabad',
        karimnagar: 'Karimnagar',
        khammam: 'Khammam',
        nalgonda: 'Nalgonda',
        rangareddy: 'Rangareddy',
        adilabad: 'Adilabad',
        mahabubnagar: 'Mahabubnagar',
        medak: 'Medak',
        sangareddy: 'Sangareddy',
        mancherial: 'Mancherial',
        kamareddy: 'Kamareddy',
        siddipet: 'Siddipet',
        vikarabad: 'Vikarabad',
        // Bihar
        patna: 'Patna',
        gaya: 'Gaya',
        bhagalpur: 'Bhagalpur',
        muzaffarpur: 'Muzaffarpur',
        darbhanga: 'Darbhanga',
        purnia: 'Purnia',
        araria: 'Araria',
        // Odisha
        bhubaneswar: 'Bhubaneswar',
        cuttack: 'Cuttack',
        puri: 'Puri',
        rourkela: 'Rourkela',
        sambalpur: 'Sambalpur',
        berhampur: 'Berhampur',
        balasore: 'Balasore',
        // Assam
        guwahati: 'Guwahati',
        dibrugarh: 'Dibrugarh',
        jorhat: 'Jorhat',
        silchar: 'Silchar',
        nagaon: 'Nagaon',
        tezpur: 'Tezpur',
        tinsukia: 'Tinsukia',
        // Jharkhand
        ranchi: 'Ranchi',
        jamshedpur: 'Jamshedpur',
        dhanbad: 'Dhanbad',
        bokaro: 'Bokaro',
        hazaribagh: 'Hazaribagh',
        giridih: 'Giridih',
        deoghar: 'Deoghar',
        // Maharashtra - New Districts
        satara: 'Satara',
        kolhapur: 'Kolhapur',
        ratnagiri: 'Ratnagiri',
        sindhudurg: 'Sindhudurg',
        sangli: 'Sangli',
        latur: 'Latur',
        usmanabad: 'Usmanabad',
        buldhana: 'Buldhana',
        akola: 'Akola',
        // Karnataka - New Districts
        bijapur: 'Bijapur',
        dharwad: 'Dharwad',
        shimoga: 'Shimoga',
        davangere: 'Davangere',
        kolar: 'Kolar',
        tumkur: 'Tumkur',
        chickmagalur: 'Chickmagalur',
        // Delhi - New Districts
        'north-east': 'North East Delhi',
        'south-east': 'South East Delhi',
        'west-delhi': 'West Delhi',
        // Tamil Nadu - New Districts
        vellore: 'Vellore',
        ranipet: 'Ranipet',
        kanchipuram: 'Kanchipuram',
        villupuram: 'Villupuram',
        cuddalore: 'Cuddalore',
        nagercoil: 'Nagercoil',
        tirunelveli: 'Tirunelveli',
        kanniyakumari: 'Kanniyakumari',
        // Uttar Pradesh - New Districts
        bareilly: 'Bareilly',
        mathura: 'Mathura',
        firozabad: 'Firozabad',
        azamgarh: 'Azamgarh',
        gorakhpur: 'Gorakhpur',
        saharanpur: 'Saharanpur',
        bijnor: 'Bijnor',
        moradabad: 'Moradabad',
        // Rajasthan - New Districts
        kintoor: 'Kintoor',
        jhunjhunu: 'Jhunjhunu',
        sikar: 'Sikar',
        churu: 'Churu',
        hanumangarh: 'Hanumangarh',
        sriganganagar: 'Sriganganagar',
        barmer: 'Barmer',
        jaisalmer: 'Jaisalmer',
        // Gujarat - New Districts
        yavatmal: 'Yavatmal',
        junagadh: 'Junagadh',
        patan: 'Patan',
        amreli: 'Amreli',
        valsad: 'Valsad',
        navsari: 'Navsari',
        porbandar: 'Porbandar',
        kutch: 'Kutch',
        // West Bengal - New Districts
        jalpaiguri: 'Jalpaiguri',
        'cooch-behar': 'Cooch Behar',
        siliguri: 'Siliguri',
        malda: 'Malda',
        'western-dinajpur': 'Western Dinajpur',
        'eastern-dinajpur': 'Eastern Dinajpur',
        bankura: 'Bankura',
        birbhum: 'Birbhum',
        // Madhya Pradesh - New Districts
        dindori: 'Dindori',
        seoni: 'Seoni',
        sidhi: 'Sidhi',
        tikamgarh: 'Tikamgarh',
        datia: 'Datia',
        raisen: 'Raisen',
        vidisha: 'Vidisha',
        hoshangabad: 'Hoshangabad',
        // Punjab - New Districts
        gurdaspur: 'Gurdaspur',
        'tarn-taran': 'Tarn Taran',
        kapurthala: 'Kapurthala',
        mansa: 'Mansa',
        sangrur: 'Sangrur',
        ferozepur: 'Ferozepur',
        firozpur: 'Firozpur',
        // Haryana - New Districts
        yamunanagar: 'Yamunanagar',
        panchkula: 'Panchkula',
        sonipat: 'Sonipat',
        ellenabad: 'Ellenabad',
        mahendragarh: 'Mahendragarh',
        nuh: 'Nuh',
        palwal: 'Palwal',
        // Kerala - New Districts
        idukki: 'Idukki',
        alappuzha: 'Alappuzha',
        pathanamthitta: 'Pathanamthitta',
        malappuram: 'Malappuram',
        ernakulam: 'Ernakulam',
        kottayam: 'Kottayam',
        wayanad: 'Wayanad',
        // Andhra Pradesh - New Districts
        'spsr-nellore': 'Sri Potti Sriramulu Nellore',
        // Telangana - New Districts
        secunderabad: 'Secunderabad',
        tandur: 'Tandur',
        // Bihar - New Districts
        'east-champaran': 'East Champaran',
        'west-champaran': 'West Champaran',
        sitamarhi: 'Sitamarhi',
        madhubani: 'Madhubani',
        saharsa: 'Saharsa',
        khagaria: 'Khagaria',
        buxar: 'Buxar',
        vaishali: 'Vaishali',
        // Odisha - New Districts
        bhadrak: 'Bhadrak',
        dhenkanal: 'Dhenkanal',
        angul: 'Angul',
        jajpur: 'Jajpur',
        kendrapara: 'Kendrapara',
        malkangiri: 'Malkangiri',
        koraput: 'Koraput',
        bargarh: 'Bargarh',
        // Assam - New Districts
        kamrup: 'Kamrup',
        barpeta: 'Barpeta',
        dhubri: 'Dhubri',
        goalpara: 'Goalpara',
        lakhimpur: 'Lakhimpur',
        sonitpur: 'Sonitpur',
        cachar: 'Cachar',
        'dima-hasao': 'Dima Hasao',
        // Jharkhand - New Districts
        singhbhum: 'Singhbhum',
        dumka: 'Dumka',
        godda: 'Godda',
        sahibganj: 'Sahibganj',
        pakur: 'Pakur',
        kolhan: 'Kolhan',
        ramgarh: 'Ramgarh'
      }
    }
  };

  const pollingStations = {
    'Maharashtra': {
      'Mumbai': [
        { id: 1, name: 'Dadar Civic Center', address: 'MG Road, Dadar East, Mumbai', status: 'operational', queue: 18, distance: '2.3 km', mapUrl: 'https://maps.google.com/?q=Dadar+Civic+Center+Mumbai' },
        { id: 2, name: 'Bandra Kurla Complex', address: 'BKC, Mumbai', status: 'operational', queue: 12, distance: '5.1 km', mapUrl: 'https://maps.google.com/?q=Bandra+Kurla+Complex+Mumbai' }
      ],
      'Pune': [
        { id: 7, name: 'Shivaji Park Sports Complex', address: 'FC Road, Shivajinagar, Pune', status: 'operational', queue: 7, distance: '3.9 km', mapUrl: 'https://maps.google.com/?q=Shivaji+Park+Pune' },
        { id: 8, name: 'Koregaon Park Community Hall', address: 'Koregaon Park, Pune', status: 'operational', queue: 11, distance: '5.0 km', mapUrl: 'https://maps.google.com/?q=Koregaon+Park+Pune' }
      ]
    },
    'Delhi': {
      'New Delhi': [
        { id: 3, name: 'Connaught Place Community Hall', address: 'Block A, Connaught Place, New Delhi', status: 'operational', queue: 12, distance: '1.8 km', mapUrl: 'https://maps.google.com/?q=Connaught+Place+New+Delhi' },
        { id: 4, name: 'Rajpath Community Center', address: 'Rajpath, New Delhi', status: 'operational', queue: 16, distance: '3.2 km', mapUrl: 'https://maps.google.com/?q=Rajpath+New+Delhi' }
      ]
    },
    'Karnataka': {
      'Bangalore': [
        { id: 5, name: 'MG Road Municipal School', address: 'MG Road, Brigade Road Junction, Bangalore', status: 'delayed', queue: 35, distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=MG+Road+Bangalore' },
        { id: 6, name: 'Indiranagar Community Hall', address: 'Indiranagar, Bangalore', status: 'operational', queue: 19, distance: '6.2 km', mapUrl: 'https://maps.google.com/?q=Indiranagar+Bangalore' }
      ]
    },
    'Tamil Nadu': {
      'Chennai': [
        { id: 9, name: 'Anna Nagar Community Center', address: '2nd Avenue, Anna Nagar West, Chennai', status: 'operational', queue: 14, distance: '2.7 km', mapUrl: 'https://maps.google.com/?q=Anna+Nagar+Chennai' },
        { id: 10, name: 'T. Nagar Community Hall', address: 'Usman Road, T. Nagar, Chennai', status: 'operational', queue: 21, distance: '4.3 km', mapUrl: 'https://maps.google.com/?q=T.Nagar+Chennai' }
      ],
      'Coimbatore': [
        { id: 45, name: 'Koundinya Village Center', address: 'Koundinya, Coimbatore', status: 'operational', queue: 13, distance: '3.2 km', mapUrl: 'https://maps.google.com/?q=Coimbatore+Tamil+Nadu' },
        { id: 46, name: 'Mettupalayam Village School', address: 'Mettupalayam, Coimbatore', status: 'operational', queue: 9, distance: '6.4 km', mapUrl: 'https://maps.google.com/?q=Mettupalayam+Coimbatore' }
      ]
    },
    'West Bengal': {
      'Kolkata': [
        { id: 11, name: 'Salt Lake City Center', address: 'Sector V, Salt Lake City, Kolkata', status: 'operational', queue: 9, distance: '5.8 km', mapUrl: 'https://maps.google.com/?q=Salt+Lake+City+Kolkata' },
        { id: 12, name: 'Park Circus Community Hall', address: 'Park Circus, Kolkata', status: 'operational', queue: 17, distance: '3.1 km', mapUrl: 'https://maps.google.com/?q=Park+Circus+Kolkata' }
      ]
    },
    'Telangana': {
      'Hyderabad': [
        { id: 13, name: 'Cyberabad IT Park Hall', address: 'HITEC City, Madhapur, Hyderabad', status: 'operational', queue: 22, distance: '4.0 km', mapUrl: 'https://maps.google.com/?q=HITEC+City+Hyderabad' },
        { id: 14, name: 'Banjara Hills Community Center', address: 'Banjara Hills, Hyderabad', status: 'operational', queue: 13, distance: '6.5 km', mapUrl: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad' }
      ]
    },
    'Uttar Pradesh': {
      'Lucknow': [
        { id: 15, name: 'Hazratganj Public Library', address: 'Park Road, Hazratganj, Lucknow', status: 'delayed', queue: 28, distance: '3.5 km', mapUrl: 'https://maps.google.com/?q=Hazratganj+Lucknow' },
        { id: 16, name: 'Gomti Nagar Community Hall', address: 'Gomti Nagar, Lucknow', status: 'operational', queue: 8, distance: '5.4 km', mapUrl: 'https://maps.google.com/?q=Gomti+Nagar+Lucknow' }
      ],
      'Agra': [
        { id: 21, name: 'Taj Nagar Community Hall', address: 'Taj Nagar, Agra', status: 'operational', queue: 19, distance: '2.1 km', mapUrl: 'https://maps.google.com/?q=Agra+Uttar+Pradesh' },
        { id: 22, name: 'Fatehabad Village Booth', address: 'Fatehabad, Agra', status: 'operational', queue: 13, distance: '8.3 km', mapUrl: 'https://maps.google.com/?q=Fatehabad+Agra' }
      ],
      'Varanasi': [
        { id: 23, name: 'Kaashi Village Polling Center', address: 'Mir Ghat, Varanasi', status: 'operational', queue: 22, distance: '1.5 km', mapUrl: 'https://maps.google.com/?q=Varanasi+Uttar+Pradesh' },
        { id: 24, name: 'Ramnagar Community School', address: 'Ramnagar, Varanasi', status: 'operational', queue: 11, distance: '9.2 km', mapUrl: 'https://maps.google.com/?q=Ramnagar+Varanasi' }
      ]
    },
    'Rajasthan': {
      'Jaipur': [
        { id: 17, name: 'City Palace Community Center', address: 'Janpath Road, Jaipur', status: 'operational', queue: 24, distance: '3.0 km', mapUrl: 'https://maps.google.com/?q=Jaipur+Rajasthan' },
        { id: 18, name: 'Malviya Village Polling Booth', address: 'Malviya Nagar, Jaipur', status: 'operational', queue: 15, distance: '6.8 km', mapUrl: 'https://maps.google.com/?q=Malviya+Nagar+Jaipur' }
      ],
      'Udaipur': [
        { id: 19, name: 'City Palace Village Center', address: 'Haldi Ghati Road, Udaipur', status: 'operational', queue: 10, distance: '4.2 km', mapUrl: 'https://maps.google.com/?q=Udaipur+Rajasthan' },
        { id: 20, name: 'Fateh Sagar Village School', address: 'Fateh Sagar, Udaipur', status: 'operational', queue: 8, distance: '7.5 km', mapUrl: 'https://maps.google.com/?q=Fateh+Sagar+Udaipur' }
      ]
    },
    'Gujarat': {
      'Ahmedabad': [
        { id: 25, name: 'Sardar Patel Village Hall', address: 'Navrangpura, Ahmedabad', status: 'operational', queue: 20, distance: '3.8 km', mapUrl: 'https://maps.google.com/?q=Ahmedabad+Gujarat' },
        { id: 26, name: 'Thaltej Village Booth', address: 'Thaltej, Ahmedabad', status: 'operational', queue: 14, distance: '7.1 km', mapUrl: 'https://maps.google.com/?q=Thaltej+Ahmedabad' }
      ],
      'Surat': [
        { id: 27, name: 'Diamond City Polling Station', address: 'Piplod, Surat', status: 'operational', queue: 26, distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=Surat+Gujarat' },
        { id: 28, name: 'Katargam Village Booth', address: 'Katargam, Surat', status: 'operational', queue: 9, distance: '6.7 km', mapUrl: 'https://maps.google.com/?q=Katargam+Surat' }
      ],
      'Vadodara': [
        { id: 29, name: 'Sayaji Garden Community Center', address: 'Opp Sayaji Garden, Vadodara', status: 'operational', queue: 16, distance: '2.9 km', mapUrl: 'https://maps.google.com/?q=Vadodara+Gujarat' },
        { id: 30, name: 'Kareli Village Polling Booth', address: 'Kareli, Vadodara', status: 'operational', queue: 12, distance: '5.2 km', mapUrl: 'https://maps.google.com/?q=Kareli+Vadodara' }
      ]
    },
    'Madhya Pradesh': {
      'Bhopal': [
        { id: 31, name: 'Van Vihar Village School', address: 'Van Vihar Road, Bhopal', status: 'operational', queue: 17, distance: '3.4 km', mapUrl: 'https://maps.google.com/?q=Bhopal+Madhya+Pradesh' },
        { id: 32, name: 'Raisen Village Polling Center', address: 'Raisen, Bhopal', status: 'operational', queue: 10, distance: '7.8 km', mapUrl: 'https://maps.google.com/?q=Raisen+Bhopal' }
      ],
      'Indore': [
        { id: 33, name: 'Madhya Marg Polling Station', address: 'Madhya Marg, Indore', status: 'operational', queue: 21, distance: '3.1 km', mapUrl: 'https://maps.google.com/?q=Indore+Madhya+Pradesh' },
        { id: 34, name: 'Mhow Village Booth', address: 'Mhow, Indore', status: 'operational', queue: 8, distance: '6.9 km', mapUrl: 'https://maps.google.com/?q=Mhow+Indore' }
      ]
    },
    'Bihar': {
      'Patna': [
        { id: 35, name: 'Patliputra Village Hall', address: 'Patliputra, Patna', status: 'operational', queue: 19, distance: '4.3 km', mapUrl: 'https://maps.google.com/?q=Patna+Bihar' },
        { id: 36, name: 'Nalanda Village School', address: 'Nalanda, Patna', status: 'operational', queue: 14, distance: '8.1 km', mapUrl: 'https://maps.google.com/?q=Nalanda+Patna' }
      ],
      'Gaya': [
        { id: 37, name: 'Vishnupad Temple Area Booth', address: 'Temple Road, Gaya', status: 'operational', queue: 12, distance: '2.6 km', mapUrl: 'https://maps.google.com/?q=Gaya+Bihar' },
        { id: 38, name: 'Wazirganj Village Center', address: 'Wazirganj, Gaya', status: 'operational', queue: 9, distance: '7.4 km', mapUrl: 'https://maps.google.com/?q=Wazirganj+Gaya' }
      ]
    },
    'Odisha': {
      'Bhubaneswar': [
        { id: 39, name: 'Nayapalli Village School', address: 'Nayapalli, Bhubaneswar', status: 'operational', queue: 15, distance: '3.7 km', mapUrl: 'https://maps.google.com/?q=Bhubaneswar+Odisha' },
        { id: 40, name: 'Samanta Chandi Village Booth', address: 'Samanta Chandi, Bhubaneswar', status: 'operational', queue: 11, distance: '6.5 km', mapUrl: 'https://maps.google.com/?q=Samanta+Chandi+Bhubaneswar' }
      ],
      'Cuttack': [
        { id: 41, name: 'Badambadi Village Center', address: 'Badambadi, Cuttack', status: 'operational', queue: 18, distance: '4.1 km', mapUrl: 'https://maps.google.com/?q=Cuttack+Odisha' },
        { id: 42, name: 'Jagatpur Village School', address: 'Jagatpur, Cuttack', status: 'operational', queue: 7, distance: '8.2 km', mapUrl: 'https://maps.google.com/?q=Jagatpur+Cuttack' }
      ]
    },
    'Andhra Pradesh': {
      'Visakhapatnam': [
        { id: 43, name: 'Vizag Village Polling Station', address: 'Gajuwaka, Visakhapatnam', status: 'operational', queue: 20, distance: '5.0 km', mapUrl: 'https://maps.google.com/?q=Visakhapatnam+Andhra+Pradesh' },
        { id: 44, name: 'Atchutapuram Village Booth', address: 'Atchutapuram, Visakhapatnam', status: 'operational', queue: 10, distance: '7.8 km', mapUrl: 'https://maps.google.com/?q=Atchutapuram+Visakhapatnam' }
      ]
    },
    'Assam': {
      'Guwahati': [
        { id: 47, name: 'Narengi Village Booth', address: 'Narengi, Guwahati', status: 'operational', queue: 11, distance: '4.6 km', mapUrl: 'https://maps.google.com/?q=Guwahati+Assam' },
        { id: 48, name: 'Kamakhya Village Center', address: 'Kamakhya Hills, Guwahati', status: 'operational', queue: 16, distance: '7.3 km', mapUrl: 'https://maps.google.com/?q=Kamakhya+Guwahati' }
      ],
      'Dibrugarh': [
        { id: 49, name: 'Oil Town Polling Station', address: 'Dibrugarh Town, Assam', status: 'operational', queue: 13, distance: '3.1 km', mapUrl: 'https://maps.google.com/?q=Dibrugarh+Assam' },
        { id: 50, name: 'Brahmaputra Valley Community Hall', address: 'Valley Road, Dibrugarh', status: 'operational', queue: 8, distance: '5.9 km', mapUrl: 'https://maps.google.com/?q=Dibrugarh+Valley' }
      ]
    },
    'Punjab': {
      'Ludhiana': [
        { id: 51, name: 'Model Town Community Center', address: 'Model Town, Ludhiana', status: 'operational', queue: 15, distance: '2.8 km', mapUrl: 'https://maps.google.com/?q=Ludhiana+Punjab' },
        { id: 52, name: 'Sarabha Nagar Polling Station', address: 'Sarabha Nagar, Ludhiana', status: 'operational', queue: 10, distance: '4.6 km', mapUrl: 'https://maps.google.com/?q=Sarabha+Nagar+Ludhiana' }
      ],
      'Amritsar': [
        { id: 53, name: 'Golden Temple Community Hall', address: 'Temple Road, Amritsar', status: 'operational', queue: 19, distance: '3.2 km', mapUrl: 'https://maps.google.com/?q=Amritsar+Punjab' },
        { id: 54, name: 'Cantonment Polling Booth', address: 'Cantonment, Amritsar', status: 'operational', queue: 12, distance: '5.1 km', mapUrl: 'https://maps.google.com/?q=Cantonment+Amritsar' }
      ]
    },
    'Haryana': {
      'Gurgaon': [
        { id: 55, name: 'DLF Cyber Hub Community Center', address: 'DLF Cyber Hub, Gurgaon', status: 'operational', queue: 22, distance: '3.5 km', mapUrl: 'https://maps.google.com/?q=DLF+Cyber+Hub+Gurgaon' },
        { id: 56, name: 'Sector 57 Polling Station', address: 'Sector 57, Gurgaon', status: 'operational', queue: 14, distance: '4.9 km', mapUrl: 'https://maps.google.com/?q=Sector+57+Gurgaon' }
      ],
      'Faridabad': [
        { id: 57, name: 'Industrial Town Community Hall', address: 'Faridabad Industrial Area', status: 'operational', queue: 18, distance: '2.9 km', mapUrl: 'https://maps.google.com/?q=Faridabad+Haryana' },
        { id: 58, name: 'NIT Faridabad Polling Center', address: 'NIT Campus, Faridabad', status: 'operational', queue: 11, distance: '5.6 km', mapUrl: 'https://maps.google.com/?q=NIT+Faridabad' }
      ]
    },
    'Kerala': {
      'Kochi': [
        { id: 59, name: 'Kochi Port Community Hall', address: 'Port Area, Kochi', status: 'operational', queue: 16, distance: '3.4 km', mapUrl: 'https://maps.google.com/?q=Kochi+Kerala' },
        { id: 60, name: 'Mattancherry Village Booth', address: 'Mattancherry, Kochi', status: 'operational', queue: 9, distance: '4.2 km', mapUrl: 'https://maps.google.com/?q=Mattancherry+Kochi' }
      ],
      'Thiruvananthapuram': [
        { id: 61, name: 'Museum Area Polling Station', address: 'Museum Road, Thiruvananthapuram', status: 'operational', queue: 14, distance: '2.7 km', mapUrl: 'https://maps.google.com/?q=Thiruvananthapuram+Kerala' },
        { id: 62, name: 'Pattom Community Center', address: 'Pattom, Thiruvananthapuram', status: 'operational', queue: 10, distance: '3.5 km', mapUrl: 'https://maps.google.com/?q=Pattom+Thiruvananthapuram' }
      ]
    },
    'Telangana': {
      'Hyderabad': [
        { id: 13, name: 'Cyberabad IT Park Hall', address: 'HITEC City, Madhapur, Hyderabad', status: 'operational', queue: 22, distance: '4.0 km', mapUrl: 'https://maps.google.com/?q=HITEC+City+Hyderabad' },
        { id: 14, name: 'Banjara Hills Community Center', address: 'Banjara Hills, Hyderabad', status: 'operational', queue: 13, distance: '6.5 km', mapUrl: 'https://maps.google.com/?q=Banjara+Hills+Hyderabad' }
      ],
      'Warangal': [
        { id: 63, name: 'Ancient Fort Area Polling Center', address: 'Fort Area, Warangal', status: 'operational', queue: 17, distance: '3.6 km', mapUrl: 'https://maps.google.com/?q=Warangal+Telangana' },
        { id: 64, name: 'Hanmakonda Community Hall', address: 'Hanmakonda, Warangal', status: 'operational', queue: 12, distance: '5.4 km', mapUrl: 'https://maps.google.com/?q=Hanmakonda+Warangal' }
      ]
    },
    'Karnataka': {
      'Bangalore': [
        { id: 5, name: 'MG Road Municipal School', address: 'MG Road, Brigade Road Junction, Bangalore', status: 'delayed', queue: 35, distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=MG+Road+Bangalore' },
        { id: 6, name: 'Indiranagar Community Hall', address: 'Indiranagar, Bangalore', status: 'operational', queue: 19, distance: '6.2 km', mapUrl: 'https://maps.google.com/?q=Indiranagar+Bangalore' }
      ],
      'Mysore': [
        { id: 65, name: 'Palace Road Polling Station', address: 'Palace Road, Mysore', status: 'operational', queue: 13, distance: '2.9 km', mapUrl: 'https://maps.google.com/?q=Mysore+Karnataka' },
        { id: 66, name: 'Gokulam Community Hall', address: 'Gokulam, Mysore', status: 'operational', queue: 8, distance: '4.7 km', mapUrl: 'https://maps.google.com/?q=Gokulam+Mysore' }
      ]
    },
    'Uttar Pradesh': {
      'Lucknow': [
        { id: 15, name: 'Hazratganj Public Library', address: 'Park Road, Hazratganj, Lucknow', status: 'delayed', queue: 28, distance: '3.5 km', mapUrl: 'https://maps.google.com/?q=Hazratganj+Lucknow' },
        { id: 16, name: 'Gomti Nagar Community Hall', address: 'Gomti Nagar, Lucknow', status: 'operational', queue: 8, distance: '5.4 km', mapUrl: 'https://maps.google.com/?q=Gomti+Nagar+Lucknow' }
      ],
      'Agra': [
        { id: 21, name: 'Taj Nagar Community Hall', address: 'Taj Nagar, Agra', status: 'operational', queue: 19, distance: '2.1 km', mapUrl: 'https://maps.google.com/?q=Agra+Uttar+Pradesh' },
        { id: 22, name: 'Fatehabad Village Booth', address: 'Fatehabad, Agra', status: 'operational', queue: 13, distance: '8.3 km', mapUrl: 'https://maps.google.com/?q=Fatehabad+Agra' }
      ],
      'Varanasi': [
        { id: 23, name: 'Kaashi Village Polling Center', address: 'Mir Ghat, Varanasi', status: 'operational', queue: 22, distance: '1.5 km', mapUrl: 'https://maps.google.com/?q=Varanasi+Uttar+Pradesh' },
        { id: 24, name: 'Ramnagar Community School', address: 'Ramnagar, Varanasi', status: 'operational', queue: 11, distance: '9.2 km', mapUrl: 'https://maps.google.com/?q=Ramnagar+Varanasi' }
      ],
      'Kanpur': [
        { id: 67, name: 'Jajmau Industrial Area Booth', address: 'Jajmau, Kanpur', status: 'operational', queue: 16, distance: '3.8 km', mapUrl: 'https://maps.google.com/?q=Kanpur+Uttar+Pradesh' },
        { id: 68, name: 'Ider Shaktinagar Community Hall', address: 'Shaktinagar, Kanpur', status: 'operational', queue: 14, distance: '5.2 km', mapUrl: 'https://maps.google.com/?q=Shaktinagar+Kanpur' }
      ]
    },
    'Rajasthan': {
      'Jaipur': [
        { id: 17, name: 'City Palace Community Center', address: 'Janpath Road, Jaipur', status: 'operational', queue: 24, distance: '3.0 km', mapUrl: 'https://maps.google.com/?q=Jaipur+Rajasthan' },
        { id: 18, name: 'Malviya Village Polling Booth', address: 'Malviya Nagar, Jaipur', status: 'operational', queue: 15, distance: '6.8 km', mapUrl: 'https://maps.google.com/?q=Malviya+Nagar+Jaipur' }
      ],
      'Udaipur': [
        { id: 19, name: 'City Palace Village Center', address: 'Haldi Ghati Road, Udaipur', status: 'operational', queue: 10, distance: '4.2 km', mapUrl: 'https://maps.google.com/?q=Udaipur+Rajasthan' },
        { id: 20, name: 'Fateh Sagar Village School', address: 'Fateh Sagar, Udaipur', status: 'operational', queue: 8, distance: '7.5 km', mapUrl: 'https://maps.google.com/?q=Fateh+Sagar+Udaipur' }
      ],
      'Jodhpur': [
        { id: 69, name: 'Mehrangarh Fort Area Polling Station', address: 'Fort Road, Jodhpur', status: 'operational', queue: 20, distance: '4.1 km', mapUrl: 'https://maps.google.com/?q=Jodhpur+Rajasthan' },
        { id: 70, name: 'Makrana Village Booth', address: 'Makrana, Jodhpur', status: 'operational', queue: 11, distance: '6.9 km', mapUrl: 'https://maps.google.com/?q=Makrana+Jodhpur' }
      ]
    },
    'Gujarat': {
      'Ahmedabad': [
        { id: 25, name: 'Sardar Patel Village Hall', address: 'Navrangpura, Ahmedabad', status: 'operational', queue: 20, distance: '3.8 km', mapUrl: 'https://maps.google.com/?q=Ahmedabad+Gujarat' },
        { id: 26, name: 'Thaltej Village Booth', address: 'Thaltej, Ahmedabad', status: 'operational', queue: 14, distance: '7.1 km', mapUrl: 'https://maps.google.com/?q=Thaltej+Ahmedabad' }
      ],
      'Surat': [
        { id: 27, name: 'Diamond City Polling Station', address: 'Piplod, Surat', status: 'operational', queue: 26, distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=Surat+Gujarat' },
        { id: 28, name: 'Katargam Village Booth', address: 'Katargam, Surat', status: 'operational', queue: 9, distance: '6.7 km', mapUrl: 'https://maps.google.com/?q=Katargam+Surat' }
      ],
      'Vadodara': [
        { id: 29, name: 'Sayaji Garden Community Center', address: 'Opp Sayaji Garden, Vadodara', status: 'operational', queue: 16, distance: '2.9 km', mapUrl: 'https://maps.google.com/?q=Vadodara+Gujarat' },
        { id: 30, name: 'Kareli Village Polling Booth', address: 'Kareli, Vadodara', status: 'operational', queue: 12, distance: '5.2 km', mapUrl: 'https://maps.google.com/?q=Kareli+Vadodara' }
      ],
      'Rajkot': [
        { id: 71, name: 'Rajkot Race Course Community Hall', address: 'Race Course, Rajkot', status: 'operational', queue: 17, distance: '3.3 km', mapUrl: 'https://maps.google.com/?q=Rajkot+Gujarat' },
        { id: 72, name: 'Kuvadva Village Booth', address: 'Kuvadva, Rajkot', status: 'operational', queue: 10, distance: '6.2 km', mapUrl: 'https://maps.google.com/?q=Kuvadva+Rajkot' }
      ]
    },
    'Madhya Pradesh': {
      'Bhopal': [
        { id: 31, name: 'Van Vihar Village School', address: 'Van Vihar Road, Bhopal', status: 'operational', queue: 17, distance: '3.4 km', mapUrl: 'https://maps.google.com/?q=Bhopal+Madhya+Pradesh' },
        { id: 32, name: 'Raisen Village Polling Center', address: 'Raisen, Bhopal', status: 'operational', queue: 10, distance: '7.8 km', mapUrl: 'https://maps.google.com/?q=Raisen+Bhopal' }
      ],
      'Indore': [
        { id: 33, name: 'Madhya Marg Polling Station', address: 'Madhya Marg, Indore', status: 'operational', queue: 21, distance: '3.1 km', mapUrl: 'https://maps.google.com/?q=Indore+Madhya+Pradesh' },
        { id: 34, name: 'Mhow Village Booth', address: 'Mhow, Indore', status: 'operational', queue: 8, distance: '6.9 km', mapUrl: 'https://maps.google.com/?q=Mhow+Indore' }
      ],
      'Gwalior': [
        { id: 73, name: 'Gwalior Fort Area Polling Station', address: 'Fort Road, Gwalior', status: 'operational', queue: 18, distance: '2.8 km', mapUrl: 'https://maps.google.com/?q=Gwalior+Madhya+Pradesh' },
        { id: 74, name: 'Lashkar Community Hall', address: 'Lashkar, Gwalior', status: 'operational', queue: 13, distance: '4.5 km', mapUrl: 'https://maps.google.com/?q=Lashkar+Gwalior' }
      ]
    },
    'Bihar': {
      'Patna': [
        { id: 35, name: 'Patliputra Village Hall', address: 'Patliputra, Patna', status: 'operational', queue: 19, distance: '4.3 km', mapUrl: 'https://maps.google.com/?q=Patna+Bihar' },
        { id: 36, name: 'Nalanda Village School', address: 'Nalanda, Patna', status: 'operational', queue: 14, distance: '8.1 km', mapUrl: 'https://maps.google.com/?q=Nalanda+Patna' }
      ],
      'Gaya': [
        { id: 37, name: 'Vishnupad Temple Area Booth', address: 'Temple Road, Gaya', status: 'operational', queue: 12, distance: '2.6 km', mapUrl: 'https://maps.google.com/?q=Gaya+Bihar' },
        { id: 38, name: 'Wazirganj Village Center', address: 'Wazirganj, Gaya', status: 'operational', queue: 9, distance: '7.4 km', mapUrl: 'https://maps.google.com/?q=Wazirganj+Gaya' }
      ],
      'Bhagalpur': [
        { id: 75, name: 'Bhagalpur Silk City Polling Station', address: 'Silk Factory Area, Bhagalpur', status: 'operational', queue: 15, distance: '3.2 km', mapUrl: 'https://maps.google.com/?q=Bhagalpur+Bihar' },
        { id: 76, name: 'Sultanganj Community Hall', address: 'Sultanganj, Bhagalpur', status: 'operational', queue: 10, distance: '5.8 km', mapUrl: 'https://maps.google.com/?q=Sultanganj+Bhagalpur' }
      ]
    },
    'Odisha': {
      'Bhubaneswar': [
        { id: 39, name: 'Nayapalli Village School', address: 'Nayapalli, Bhubaneswar', status: 'operational', queue: 15, distance: '3.7 km', mapUrl: 'https://maps.google.com/?q=Bhubaneswar+Odisha' },
        { id: 40, name: 'Samanta Chandi Village Booth', address: 'Samanta Chandi, Bhubaneswar', status: 'operational', queue: 11, distance: '6.5 km', mapUrl: 'https://maps.google.com/?q=Samanta+Chandi+Bhubaneswar' }
      ],
      'Cuttack': [
        { id: 41, name: 'Badambadi Village Center', address: 'Badambadi, Cuttack', status: 'operational', queue: 18, distance: '4.1 km', mapUrl: 'https://maps.google.com/?q=Cuttack+Odisha' },
        { id: 42, name: 'Jagatpur Village School', address: 'Jagatpur, Cuttack', status: 'operational', queue: 7, distance: '8.2 km', mapUrl: 'https://maps.google.com/?q=Jagatpur+Cuttack' }
      ],
      'Puri': [
        { id: 77, name: 'Jagannath Temple Area Community Hall', address: 'Temple Road, Puri', status: 'operational', queue: 20, distance: '3.4 km', mapUrl: 'https://maps.google.com/?q=Puri+Odisha' },
        { id: 78, name: 'Satyabadi Village Booth', address: 'Satyabadi, Puri', status: 'operational', queue: 12, distance: '5.9 km', mapUrl: 'https://maps.google.com/?q=Satyabadi+Puri' }
      ]
    },
    'Andhra Pradesh': {
      'Visakhapatnam': [
        { id: 43, name: 'Vizag Village Polling Station', address: 'Gajuwaka, Visakhapatnam', status: 'operational', queue: 20, distance: '5.0 km', mapUrl: 'https://maps.google.com/?q=Visakhapatnam+Andhra+Pradesh' },
        { id: 44, name: 'Atchutapuram Village Booth', address: 'Atchutapuram, Visakhapatnam', status: 'operational', queue: 10, distance: '7.8 km', mapUrl: 'https://maps.google.com/?q=Atchutapuram+Visakhapatnam' }
      ],
      'Vijayawada': [
        { id: 79, name: 'Krishna River Valley Polling Center', address: 'River Road, Vijayawada', status: 'operational', queue: 16, distance: '3.7 km', mapUrl: 'https://maps.google.com/?q=Vijayawada+Andhra+Pradesh' },
        { id: 80, name: 'Kanuru Community Hall', address: 'Kanuru, Vijayawada', status: 'operational', queue: 13, distance: '4.9 km', mapUrl: 'https://maps.google.com/?q=Kanuru+Vijayawada' }
      ]
    }
  };

  const elections = [
    {
      id: 1,
      title: 'West Bengal Legislative Assembly Election 2026',
      badge: 'ongoing',
      date: '3/15/2026',
      daysRemaining: 18,
      registrationDeadline: '2/20/2026',
      daysLeft: -5,
      country: 'india',
      state: 'west-bengal',
      district: 'kolkata',
      turnout: 62.5
    },
    {
      id: 2,
      title: 'Tamil Nadu Legislative Assembly Election 2026',
      badge: 'upcoming',
      date: '5/10/2026',
      daysRemaining: 74,
      registrationDeadline: '4/15/2026',
      daysLeft: 49,
      country: 'india',
      state: 'tamil-nadu',
      district: 'chennai',
      turnout: null
    },
    {
      id: 3,
      title: 'Kerala Municipal Corporation Elections',
      badge: 'upcoming',
      date: '4/20/2026',
      daysRemaining: 54,
      registrationDeadline: '3/25/2026',
      daysLeft: 28,
      country: 'india',
      state: 'kerala',
      district: 'thiruvananthapuram',
      turnout: null
    },
    {
      id: 4,
      title: 'Punjab Legislative Assembly By-Election',
      badge: 'upcoming',
      date: '3/28/2026',
      daysRemaining: 31,
      registrationDeadline: '3/10/2026',
      daysLeft: 13,
      country: 'india',
      state: 'punjab',
      district: 'ludhiana',
      turnout: null
    },
    {
      id: 5,
      title: 'Maharashtra Municipal Corporation Elections',
      badge: 'upcoming',
      date: '6/15/2026',
      daysRemaining: 110,
      registrationDeadline: '5/20/2026',
      daysLeft: 84,
      country: 'india',
      state: 'maharashtra',
      district: 'mumbai',
      turnout: null
    },
    {
      id: 6,
      title: 'Assam Legislative Assembly Election 2026',
      badge: 'upcoming',
      date: '4/5/2026',
      daysRemaining: 39,
      registrationDeadline: '3/15/2026',
      daysLeft: 18,
      country: 'india',
      state: 'assam',
      district: 'guwahati',
      turnout: null
    },
    {
      id: 7,
      title: 'Uttar Pradesh Lok Sabha By-Election',
      badge: 'ongoing',
      date: '2/28/2026',
      daysRemaining: 3,
      registrationDeadline: '2/10/2026',
      daysLeft: -15,
      country: 'india',
      state: 'uttar-pradesh',
      district: 'lucknow',
      turnout: 58.3
    },
    {
      id: 8,
      title: 'Karnataka Legislative Council Election',
      badge: 'upcoming',
      date: '3/22/2026',
      daysRemaining: 25,
      registrationDeadline: '3/5/2026',
      daysLeft: 8,
      country: 'india',
      state: 'karnataka',
      district: 'bangalore',
      turnout: null
    }
  ];

  const getAvailableElections = () => {
    if (!userLocation.country) return elections;
    
    return elections.filter(election => {
      const countryMatch = election.country === userLocation.country;
      const stateMatch = !userLocation.state || election.state === userLocation.state;
      const districtMatch = !userLocation.district || election.district === userLocation.district || election.district === '';
      
      return countryMatch && stateMatch && districtMatch;
    });
  };

  const getRegisterStates = () => {
    if (!locationData.india) return [];
    return locationData.india.states;
  };

  const getRegisterDistricts = (stateCode) => {
    if (!stateCode || !locationData.india) return [];
    return locationData.india.districts[stateCode] || [];
  };

  const getStateLabel = (stateCode) => {
    if (!locationData.india) return stateCode;
    return locationData.india.stateNames[stateCode] || stateCode;
  };

  const getDistrictLabel = (districtCode) => {
    if (!locationData.india) return districtCode;
    return locationData.india.districtNames[districtCode] || districtCode;
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  const handleRegisterChange = (field, value) => {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!registerForm.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!registerForm.parentName.trim()) errors.parentName = 'Parent name is required.';
    if (!registerForm.dob) {
      errors.dob = 'Date of birth is required.';
    } else {
      const age = calculateAge(registerForm.dob);
      if (age === null) errors.dob = 'Enter a valid date.';
      if (age !== null && age < 18) errors.dob = 'You must be 18 or older.';
    }
    if (!registerForm.gender) errors.gender = 'Gender is required.';
    if (!/^\d{12}$/.test(registerForm.aadhaar)) errors.aadhaar = 'Aadhaar must be 12 digits.';
    if (!/^\d{10}$/.test(registerForm.mobile)) errors.mobile = 'Mobile must be 10 digits.';
    if (!registerForm.email.trim()) errors.email = 'Email is required.';
    if (!registerForm.houseNumber.trim()) errors.houseNumber = 'House number is required.';
    if (!registerForm.street.trim()) errors.street = 'Street/Area is required.';
    if (!registerForm.city.trim()) errors.city = 'City is required.';
    if (!registerForm.district) errors.district = 'District is required.';
    if (!registerForm.state) errors.state = 'State is required.';
    if (!/^\d{6}$/.test(registerForm.pin)) errors.pin = 'PIN code must be 6 digits.';
    if (!registerForm.constituency) errors.constituency = 'Constituency is required.';
    if (!registerForm.declaration) {
      errors.declaration = 'You must confirm the declaration.';
    }

    setRegisterErrors(errors);
    setRegisterMessage('');

    if (Object.keys(errors).length > 0) return;

    const voterId = `VOTE${Math.floor(100000 + Math.random() * 900000)}`;
    setRegisterVoterId(voterId);
    setRegisterMessage('Registration submitted for admin verification');
    setRegisterForm(getInitialRegisterForm());
    setUserLocation({
      country: 'india',
      state: registerForm.state,
      district: registerForm.district
    });
  };



  const handleSubmitReport = (e) => {
    e.preventDefault();
    
    const newReport = {
      id: submittedReports.length + 1,
      type: issueType,
      status: 'Pending Review',
      location: pollingStation,
      description: description,
      severity: severity,
      date: new Date().toLocaleDateString()
    };

    setSubmittedReports([newReport, ...submittedReports]);
    console.log('Report submitted:', newReport);
    
    // Reset form
    setIssueType('');
    setPollingStation('');
    setSeverity('');
    setDescription('');
  };

  const handleSwitchRole = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  const handleUpdatePhone = () => {
    if (profileData.phone.trim() === '') {
      alert('Please enter a phone number');
      return;
    }
    console.log('Phone updated:', profileData.phone);
    setShowProfileModal(false);
  };

  const handleChangePassword = () => {
    if (profileData.newPassword === '' || profileData.confirmPassword === '') {
      alert('Please fill in all password fields');
      return;
    }
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (profileData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    console.log('Password changed successfully');
    setProfileData({
      ...profileData,
      newPassword: '',
      confirmPassword: ''
    });
    alert('Password changed successfully');
  };

  const handleDeleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setSubmittedReports(submittedReports.filter(report => report.id !== id));
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'In Progress') return 'in-progress';
    if (status === 'Pending Review') return 'pending';
    if (status === 'Resolved') return 'resolved';
    return 'pending';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setViolationImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setViolationImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    
    const newComplaint = {
      id: submittedReports.length + 1,
      type: violationType,
      status: 'Reported',
      location: violationLocation,
      description: violationDescription,
      severity: 'high',
      image: violationImagePreview,
      date: new Date().toLocaleDateString()
    };

    setSubmittedReports([newComplaint, ...submittedReports]);
    console.log('Complaint submitted:', newComplaint);
    
    // Reset form
    setViolationType('');
    setViolationLocation('');
    setViolationDescription('');
    setViolationImage(null);
    setViolationImagePreview(null);
  };

  const handleDeleteComplaint = (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      setSubmittedComplaints(submittedComplaints.filter(complaint => complaint.id !== id));
    }
  };

  return (
    <div className="citizen-portal">
        {/* Header */}
        <header className="portal-header">
        <div className="header-left">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M 9 12 L 11 14 L 15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-info">
            <h1 className="header-title">Election Monitoring System</h1>
            <p className="header-subtitle">Ensuring transparency and integrity</p>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="header-nav">
          <button 
            className={`nav-link ${activeTab === 'elections' ? 'active' : ''}`}
            onClick={() => setActiveTab('elections')}
          >
            Upcoming Elections
          </button>
          <button 
            className={`nav-link ${activeTab === 'reportViolation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reportViolation')}
          >
            Report Violation
          </button>
          <button 
            className={`nav-link ${activeTab === 'myReports' ? 'active' : ''}`}
            onClick={() => setActiveTab('myReports')}
          >
            My Reports
          </button>
          <button 
            className={`nav-link ${activeTab === 'pollingStations' ? 'active' : ''}`}
            onClick={() => setActiveTab('pollingStations')}
          >
            Polling Stations
          </button>
        </nav>
        
        <div className="header-right">
          <button
            className="profile-btn"
            onClick={() => {
              setActiveProfileTab('details');
              setShowProfileModal(true);
            }}
            title="View Profile"
          >
            Profile
          </button>
          <button
            className="signout-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                onLogout();
                navigate('/');
              }
            }}
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-main">
        <div className="portal-container">
          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-section">
              <h2 className="page-title">Citizen Portal</h2>
              <p className="page-description">Track elections, report issues, and engage with your community</p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'elections' && (
              <div className="elections-section">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">Available Elections</h3>
                    <p className="section-subtitle">
                      {userLocation.country ? `Elections for ${userLocation.state || userLocation.country}` : 'Register to see elections for your location'}
                    </p>
                  </div>
                </div>

                {getAvailableElections().length === 0 ? (
                  <div className="no-elections-message">
                    <p>No elections found for your location.</p>
                    <p>Please register to vote to see available elections in your area.</p>
                  </div>
                ) : (
                  <div className="elections-list">
                    {getAvailableElections().map((election) => (
                      <div key={election.id} className="election-card">
                        <div className="election-header">
                          <div className="election-info">
                            <h4 className="election-title">{election.title}</h4>
                            <span className={`election-badge ${election.badge}`}>{election.badge}</span>
                          </div>
                          <button
                            className="election-action-btn primary"
                            onClick={() => setShowRegisterModal(true)}
                          >
                            Register to Vote
                          </button>
                        </div>
                        <div className="election-details">
                          <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div>
                              <p className="detail-label">Election Date</p>
                              <p className="detail-value">{election.date}</p>
                              <p className="detail-note blue">{election.daysRemaining} days remaining</p>
                            </div>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">⏰</span>
                            <div>
                              <p className="detail-label">Registration Deadline</p>
                              <p className="detail-value">{election.registrationDeadline}</p>
                              <p className="detail-note red">{election.daysLeft} days left</p>
                            </div>
                          </div>
                        </div>
                        {election.turnout && (
                          <div className="turnout-section">
                            <div className="turnout-header">
                              <span className="turnout-label">Current Turnout</span>
                              <span className="turnout-percentage">{election.turnout}%</span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${election.turnout}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Register to Vote Modal */}
            {showRegisterModal && (
              <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
                <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Register to Vote</h3>
                    <button className="modal-close" onClick={() => setShowRegisterModal(false)}>×</button>
                  </div>

                  {registerMessage && (
                    <div className="register-success">
                      <p>{registerMessage}</p>
                      {registerVoterId && (
                        <p className="success-id">Voter ID: {registerVoterId}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <form className="register-form" onSubmit={handleRegisterSubmit} noValidate>
                      <div className="form-section">
                        <h4 className="form-section-title">Personal Information</h4>
                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor="regFullName">Full Name *</label>
                            <input
                              id="regFullName"
                              type="text"
                              value={registerForm.fullName}
                              onChange={(e) => handleRegisterChange('fullName', e.target.value)}
                            />
                            {registerErrors.fullName && <span className="field-error">{registerErrors.fullName}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regParentName">Father/Mother Name *</label>
                            <input
                              id="regParentName"
                              type="text"
                              value={registerForm.parentName}
                              onChange={(e) => handleRegisterChange('parentName', e.target.value)}
                            />
                            {registerErrors.parentName && <span className="field-error">{registerErrors.parentName}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regDob">Date of Birth *</label>
                            <input
                              id="regDob"
                              type="date"
                              value={registerForm.dob}
                              onChange={(e) => handleRegisterChange('dob', e.target.value)}
                            />
                            {registerErrors.dob && <span className="field-error">{registerErrors.dob}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regGender">Gender *</label>
                            <select
                              id="regGender"
                              value={registerForm.gender}
                              onChange={(e) => handleRegisterChange('gender', e.target.value)}
                            >
                              <option value="">-- Select --</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            {registerErrors.gender && <span className="field-error">{registerErrors.gender}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regAadhaar">Aadhaar Number *</label>
                            <input
                              id="regAadhaar"
                              type="text"
                              inputMode="numeric"
                              maxLength="12"
                              value={registerForm.aadhaar}
                              onChange={(e) => handleRegisterChange('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
                            />
                            {registerErrors.aadhaar && <span className="field-error">{registerErrors.aadhaar}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regMobile">Mobile Number *</label>
                            <input
                              id="regMobile"
                              type="text"
                              inputMode="numeric"
                              maxLength="10"
                              value={registerForm.mobile}
                              onChange={(e) => handleRegisterChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                            {registerErrors.mobile && <span className="field-error">{registerErrors.mobile}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regEmail">Email ID *</label>
                            <input
                              id="regEmail"
                              type="email"
                              value={registerForm.email}
                              onChange={(e) => handleRegisterChange('email', e.target.value)}
                            />
                            {registerErrors.email && <span className="field-error">{registerErrors.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h4 className="form-section-title">Address Details</h4>
                        <div className="form-grid">
                          <div className="form-field">
                            <label htmlFor="regHouse">House Number *</label>
                            <input
                              id="regHouse"
                              type="text"
                              value={registerForm.houseNumber}
                              onChange={(e) => handleRegisterChange('houseNumber', e.target.value)}
                            />
                            {registerErrors.houseNumber && <span className="field-error">{registerErrors.houseNumber}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regStreet">Street/Area *</label>
                            <input
                              id="regStreet"
                              type="text"
                              value={registerForm.street}
                              onChange={(e) => handleRegisterChange('street', e.target.value)}
                            />
                            {registerErrors.street && <span className="field-error">{registerErrors.street}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regCity">City *</label>
                            <input
                              id="regCity"
                              type="text"
                              value={registerForm.city}
                              onChange={(e) => handleRegisterChange('city', e.target.value)}
                            />
                            {registerErrors.city && <span className="field-error">{registerErrors.city}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regState">State *</label>
                            <select
                              id="regState"
                              value={registerForm.state}
                              onChange={(e) => {
                                handleRegisterChange('state', e.target.value);
                                handleRegisterChange('district', '');
                              }}
                            >
                              <option value="">-- Select --</option>
                              {getRegisterStates().map((stateCode) => (
                                <option key={stateCode} value={stateCode}>{getStateLabel(stateCode)}</option>
                              ))}
                            </select>
                            {registerErrors.state && <span className="field-error">{registerErrors.state}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regDistrict">District *</label>
                            <select
                              id="regDistrict"
                              value={registerForm.district}
                              onChange={(e) => handleRegisterChange('district', e.target.value)}
                              disabled={!registerForm.state}
                            >
                              <option value="">-- Select --</option>
                              {getRegisterDistricts(registerForm.state).map((districtCode) => (
                                <option key={districtCode} value={districtCode}>{getDistrictLabel(districtCode)}</option>
                              ))}
                            </select>
                            {registerErrors.district && <span className="field-error">{registerErrors.district}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regPin">PIN Code *</label>
                            <input
                              id="regPin"
                              type="text"
                              inputMode="numeric"
                              maxLength="6"
                              value={registerForm.pin}
                              onChange={(e) => handleRegisterChange('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                            {registerErrors.pin && <span className="field-error">{registerErrors.pin}</span>}
                          </div>
                          <div className="form-field">
                            <label htmlFor="regConstituency">Constituency *</label>
                            <select
                              id="regConstituency"
                              value={registerForm.constituency}
                              onChange={(e) => handleRegisterChange('constituency', e.target.value)}
                            >
                              <option value="">-- Select --</option>
                              <option value="urban-north">Urban North</option>
                              <option value="urban-south">Urban South</option>
                              <option value="rural-east">Rural East</option>
                              <option value="rural-west">Rural West</option>
                            </select>
                            {registerErrors.constituency && <span className="field-error">{registerErrors.constituency}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="form-section declaration-section">
                        <label className="declaration-row">
                          <input
                            type="checkbox"
                            checked={registerForm.declaration}
                            onChange={(e) => handleRegisterChange('declaration', e.target.checked)}
                          />
                          <span>I confirm that I am 18 years or older and a citizen of India.</span>
                        </label>
                        {registerErrors.declaration && <span className="field-error">{registerErrors.declaration}</span>}
                      </div>

                      <div className="register-actions">
                        <button className="register-submit" type="submit">Submit Registration</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
              <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
                <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>My Profile</h3>
                    <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
                  </div>

                  <div className="profile-tabs">
                    <button
                      className={`profile-tab-btn ${activeProfileTab === 'details' ? 'tabs-active' : ''}`}
                      onClick={() => setActiveProfileTab('details')}
                      type="button"
                    >
                      View Details
                    </button>
                    <button
                      className={`profile-tab-btn ${activeProfileTab === 'phone' ? 'tabs-active' : ''}`}
                      onClick={() => setActiveProfileTab('phone')}
                      type="button"
                    >
                      Update Phone
                    </button>
                    <button
                      className={`profile-tab-btn ${activeProfileTab === 'password' ? 'tabs-active' : ''}`}
                      onClick={() => setActiveProfileTab('password')}
                      type="button"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="profile-content">
                    {activeProfileTab === 'details' && (
                      <div className="profile-section">
                      <h4 className="section-title">View Basic Details</h4>
                      <div className="profile-header">
                        <div className="profile-avatar">👤</div>
                        <div className="profile-basic">
                          <h4>{profileData.name}</h4>
                          <p>{profileData.email}</p>
                        </div>
                      </div>
                      
                      <div className="profile-details">
                        <div className="detail-row">
                          <span className="detail-label">Name:</span>
                          <span className="detail-value">{profileData.name}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value">{profileData.email}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Phone:</span>
                          <span className="detail-value">{profileData.phone}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Aadhaar:</span>
                          <span className="detail-value">{profileData.aadhaar} <small>(Cannot be changed)</small></span>
                        </div>
                      </div>
                      </div>
                    )}

                    {activeProfileTab === 'phone' && (
                      <div className="profile-section">
                        <h4 className="section-title">Update Phone Number</h4>
                        <div className="form-field">
                          <label>Current Phone</label>
                          <input type="text" value={profileData.phone} disabled className="disabled-input" />
                        </div>
                        <div className="form-field">
                          <label htmlFor="newPhone">New Phone Number *</label>
                          <input
                            type="tel"
                            id="newPhone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="Enter new phone number"
                          />
                        </div>
                        <button className="submit-btn" onClick={handleUpdatePhone}>Update Phone</button>
                      </div>
                    )}

                    {activeProfileTab === 'password' && (
                      <div className="profile-section">
                        <h4 className="section-title">Change Password</h4>
                        <div className="form-field">
                          <label htmlFor="newPassword">New Password *</label>
                          <input
                            type="password"
                            id="newPassword"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="confirmPassword">Confirm Password *</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                            placeholder="Confirm your password"
                          />
                        </div>
                        <button className="submit-btn" onClick={handleChangePassword}>Change Password</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'myReports' && (
              <div className="my-reports-section">
                <div className="section-header">
                  <div>
                    <h3 className="section-title">My Reports</h3>
                    <p className="section-subtitle">Track the status of your submitted reports</p>
                  </div>
                </div>

                <div className="reports-list">
                  {submittedReports.length > 0 ? (
                    submittedReports.map((report) => (
                      <div key={report.id} className="report-item">
                        <div className="report-header">
                          <div className="report-badges">
                            <span className="report-type-badge">{report.type}</span>
                            <span className={`report-status-badge ${getStatusBadgeClass(report.status)}`}>{report.status}</span>
                          </div>
                          <div className="report-actions">
                            <span className="report-date">{report.date}</span>
                            <button className="delete-report-btn" onClick={() => handleDeleteReport(report.id)} title="Delete report">Delete</button>
                          </div>
                        </div>
                        <h4 className="report-location">{report.location}</h4>
                        <p className="report-description">{report.description}</p>
                        {report.severity && <p className="report-severity"><strong>Severity:</strong> {report.severity}</p>}
                        {report.image && (
                          <div className="report-image-container">
                            <img src={report.image} alt="Report evidence" className="report-image" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-reports">
                      <p>No reports submitted yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reportViolation' && (
              <div className="report-violation-section">
                <div className="section-header">
                  <div className="section-icon">!</div>
                  <div>
                    <h3 className="section-title">Report Election Violation</h3>
                    <p className="section-subtitle">Help us maintain fair and transparent elections by reporting any violations</p>
                  </div>
                </div>

                <div className="violation-form-container">
                  <form onSubmit={handleSubmitComplaint} className="violation-form">
                    <div className="form-group">
                      <label htmlFor="violationType" className="form-label">Type of Violation</label>
                      <select
                        id="violationType"
                        value={violationType}
                        onChange={(e) => setViolationType(e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">-- Select Violation Type --</option>
                        <option value="intimidation">Voter Intimidation</option>
                        <option value="bribery">Bribery / Inducement</option>
                        <option value="violence">Electoral Violence</option>
                        <option value="fraud">Voting Fraud</option>
                        <option value="irregularity">Polling Station Irregularity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="violationLocation" className="form-label">Location</label>
                      <input
                        id="violationLocation"
                        type="text"
                        placeholder="Enter the location of the violation"
                        value={violationLocation}
                        onChange={(e) => setViolationLocation(e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="violationDescription" className="form-label">Description</label>
                      <textarea
                        id="violationDescription"
                        placeholder="Provide a detailed description of the violation"
                        value={violationDescription}
                        onChange={(e) => setViolationDescription(e.target.value)}
                        className="form-textarea"
                        rows="5"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="violationImage" className="form-label">Upload Evidence (Optional)</label>
                      <input
                        id="violationImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-file-input"
                      />
                      {violationImagePreview && (
                        <div className="image-preview">
                          <img src={violationImagePreview} alt="Preview" className="preview-image" />
                        </div>
                      )}
                    </div>

                    <button type="submit" className="submit-btn primary">Submit Violation Report</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'pollingStations' && (
              <div className="polling-stations-section">
                <div className="section-header">
                  <div className="section-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img" aria-label="Polling station logo">
                      <rect x="6" y="7" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M 9 12 L 11 14 L 15 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 12 4 L 12 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="section-title">Find Your Polling Station</h3>
                    <p className="section-subtitle">Select your location to find nearby polling stations and check their status</p>
                  </div>
                </div>

                {/* Location Selector */}
                <div className="location-selector-container">
                  {/* State Selector */}
                  <div className="selector-group">
                    <label htmlFor="pollingState" className="location-label">Step 1: Select Your State:</label>
                    <select
                      id="pollingState"
                      value={selectedPollingState}
                      onChange={(e) => {
                        setSelectedPollingState(e.target.value);
                        setSelectedPollingDistrict(''); // Reset district when state changes
                      }}
                      className="location-select"
                    >
                      <option value="">-- Choose a State --</option>
                      {Object.keys(pollingStations).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Selector */}
                  {selectedPollingState && (
                    <div className="selector-group">
                      <label htmlFor="pollingDistrict" className="location-label">Step 2: Select Your District:</label>
                      <select
                        id="pollingDistrict"
                        value={selectedPollingDistrict}
                        onChange={(e) => setSelectedPollingDistrict(e.target.value)}
                        className="location-select"
                      >
                        <option value="">-- Choose a District --</option>
                        {Object.keys(pollingStations[selectedPollingState]).map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {selectedPollingState && selectedPollingDistrict && (
                  <div className="stations-list">
                    {pollingStations[selectedPollingState][selectedPollingDistrict].map((station) => (
                      <div key={station.id} className="station-card">
                        <div className="station-header">
                          <div>
                            <h4 className="station-name">{station.name}</h4>
                            <span className={`station-status ${station.status}`}>{station.status}</span>
                          </div>
                          <button 
                            onClick={() => setSelectedMapStation(station)}
                            className="directions-btn"
                          >
                            Get Directions
                          </button>
                        </div>
                        <p className="station-address">{station.address}</p>
                        <div className="station-details">
                          <div className="detail-item">
                            <span className="detail-label">Distance:</span>
                            <p className="station-distance"><strong>{station.distance}</strong></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!selectedPollingState && (
                  <div className="no-location-selected">
                    <p>Please select a state from above to view available districts</p>
                  </div>
                )}

                {selectedPollingState && !selectedPollingDistrict && (
                  <div className="no-location-selected">
                    <p>Please select a district to view polling stations</p>
                  </div>
                )}

                {/* Map Modal */}
                {selectedMapStation && (
                  <div className="map-modal-overlay">
                    <div className="map-modal">
                      <div className="map-modal-header">
                        <h3>{selectedMapStation.name}</h3>
                        <button 
                          className="map-modal-close"
                          onClick={() => setSelectedMapStation(null)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="map-modal-content">
                        <div className="station-info">
                          <p><strong>Address:</strong> {selectedMapStation.address}</p>
                          <p><strong>Distance:</strong> {selectedMapStation.distance}</p>
                          <p><strong>Status:</strong> <span className={`status-badge ${selectedMapStation.status}`}>{selectedMapStation.status}</span></p>
                        </div>
                        <div className="map-container">
                          <div className="map-preview">
                            <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="map-illustration">
                              <rect width="500" height="300" fill="#e8f4f8"/>
                              <path d="M50,150 Q150,50 250,150 T450,150" stroke="#667eea" strokeWidth="3" fill="none"/>
                              <circle cx="80" cy="120" r="8" fill="#667eea"/>
                              <circle cx="250" cy="150" r="12" fill="#ff4444"/>
                              <circle cx="420" cy="190" r="8" fill="#667eea"/>
                              <text x="250" y="280" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#2c3e50">
                                📍 Location: {selectedMapStation.address}
                              </text>
                            </svg>
                          </div>
                        </div>
                        <div className="map-actions">
                          <a href={selectedMapStation.mapUrl} target="_blank" rel="noopener noreferrer" className="open-maps-btn">
                            Open Full Map in Google Maps
                          </a>
                          <button 
                            onClick={() => setSelectedMapStation(null)}
                            className="close-map-btn"
                          >
                            Close Map
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CitizenPortal;
