import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './district/SearchBar';
import DistrictOverview from './district/DistrictOverview';
import StatisticsCards from './district/StatisticsCards';
import StationTable from './district/StationTable';
import ChartsSection from './district/ChartsSection';
import TransparencyPanel from './district/TransparencyPanel';
import './ElectionObserverDashboard.css';
import './district/DistrictObserverDashboard.css';

function DistrictObserverDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrictId, setSelectedDistrictId] = useState('D-01');
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('analysis');

  const [districts, setDistricts] = useState([
    {
      id: 'D-01',
      name: 'Downtown District',
      state: 'Maharashtra',
      phase: 'Phase 1',
      observer: 'Aarav Mehta',
      status: 'active',
      registeredVoters: 45200,
      maleVoters: 23200,
      femaleVoters: 21800,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-101',
          name: 'Central Community Center',
          boothNo: 'B-12',
          registeredVoters: 1200,
          votesCast: 860
        },
        {
          id: 'PS-102',
          name: 'Metro High School',
          boothNo: 'B-08',
          registeredVoters: 950,
          votesCast: 510
        },
        {
          id: 'PS-103',
          name: 'City Library Hall',
          boothNo: 'B-04',
          registeredVoters: 1100,
          votesCast: 920
        }
      ],
      complaints: [
        'Queue management delay reported at Metro High School.',
        'ID verification counters need additional support.'
      ],
      incidents: [
        'Temporary power fluctuation handled within 5 minutes.'
      ],
      notes: [
        'Security presence increased in central zone.'
      ]
    },
    {
      id: 'D-02',
      name: 'North Zone',
      state: 'Maharashtra',
      phase: 'Phase 2',
      observer: 'Neha Kapoor',
      status: 'active',
      registeredVoters: 38950,
      maleVoters: 19800,
      femaleVoters: 18950,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-201',
          name: 'North Park Library',
          boothNo: 'A-16',
          registeredVoters: 980,
          votesCast: 660
        },
        {
          id: 'PS-202',
          name: 'Lakeside Community Hall',
          boothNo: 'A-03',
          registeredVoters: 1040,
          votesCast: 420
        },
        {
          id: 'PS-203',
          name: 'Hillview Cultural Center',
          boothNo: 'A-11',
          registeredVoters: 900,
          votesCast: 730
        }
      ],
      complaints: [
        'Polling staff requested additional ballot papers.'
      ],
      incidents: [
        'No major incidents reported.'
      ],
      notes: [
        'Queue length stabilized after 11:00 AM.'
      ]
    },
    {
      id: 'D-03',
      name: 'West District',
      state: 'Maharashtra',
      phase: 'Phase 1',
      observer: 'Rohan Iyer',
      status: 'closed',
      registeredVoters: 41200,
      maleVoters: 21050,
      femaleVoters: 20080,
      otherVoters: 70,
      pollingStations: [
        {
          id: 'PS-301',
          name: 'Westside High School',
          boothNo: 'C-05',
          registeredVoters: 1150,
          votesCast: 990
        },
        {
          id: 'PS-302',
          name: 'Riverfront Auditorium',
          boothNo: 'C-09',
          registeredVoters: 980,
          votesCast: 760
        },
        {
          id: 'PS-303',
          name: 'Greenfield Primary',
          boothNo: 'C-02',
          registeredVoters: 870,
          votesCast: 620
        }
      ],
      complaints: [
        'No active complaints - polling closed.'
      ],
      incidents: [
        'Minor equipment maintenance completed before close.'
      ],
      notes: [
        'Final tally verification underway.'
      ]
    },
    {
      id: 'D-04',
      name: 'South District',
      state: 'Karnataka',
      phase: 'Phase 2',
      observer: 'Sneha Rao',
      status: 'active',
      registeredVoters: 36840,
      maleVoters: 18210,
      femaleVoters: 18300,
      otherVoters: 330,
      pollingStations: [
        {
          id: 'PS-401',
          name: 'South Town Hall',
          boothNo: 'D-07',
          registeredVoters: 1020,
          votesCast: 640
        },
        {
          id: 'PS-402',
          name: 'Harbor Secondary School',
          boothNo: 'D-03',
          registeredVoters: 960,
          votesCast: 520
        },
        {
          id: 'PS-403',
          name: 'Garden Civic Center',
          boothNo: 'D-11',
          registeredVoters: 880,
          votesCast: 710
        }
      ],
      complaints: [
        'Need additional signage for entry lanes.'
      ],
      incidents: [
        'No major incidents reported.'
      ],
      notes: [
        'Volunteer presence increased near peak hours.'
      ]
    },
    {
      id: 'D-05',
      name: 'East District',
      state: 'Karnataka',
      phase: 'Phase 1',
      observer: 'Vikram Singh',
      status: 'active',
      registeredVoters: 42110,
      maleVoters: 21490,
      femaleVoters: 20370,
      otherVoters: 250,
      pollingStations: [
        {
          id: 'PS-501',
          name: 'Riverside Community Center',
          boothNo: 'E-02',
          registeredVoters: 1120,
          votesCast: 780
        },
        {
          id: 'PS-502',
          name: 'Eastside Public School',
          boothNo: 'E-09',
          registeredVoters: 980,
          votesCast: 560
        },
        {
          id: 'PS-503',
          name: 'Sunrise Auditorium',
          boothNo: 'E-15',
          registeredVoters: 920,
          votesCast: 690
        }
      ],
      complaints: [
        'Queue length increased after noon.'
      ],
      incidents: [
        'Brief connectivity drop resolved.'
      ],
      notes: [
        'Additional help desk installed.'
      ]
    },
    {
      id: 'D-06',
      name: 'Chennai',
      state: 'Tamil Nadu',
      phase: 'Phase 1',
      observer: 'Priya Raman',
      status: 'active',
      registeredVoters: 52300,
      maleVoters: 26100,
      femaleVoters: 25900,
      otherVoters: 300,
      pollingStations: [
        {
          id: 'PS-601',
          name: 'T Nagar Community Hall',
          boothNo: 'TN-01',
          registeredVoters: 1350,
          votesCast: 950
        },
        {
          id: 'PS-602',
          name: 'Anna Nagar School',
          boothNo: 'TN-04',
          registeredVoters: 1200,
          votesCast: 780
        }
      ],
      complaints: ['Waiting time increased during peak hours.'],
      incidents: ['No major incidents.'],
      notes: ['Water facility ensured at all stations.']
    },
    {
      id: 'D-07',
      name: 'Coimbatore',
      state: 'Tamil Nadu',
      phase: 'Phase 2',
      observer: 'Karthik Subramanian',
      status: 'active',
      registeredVoters: 39800,
      maleVoters: 19900,
      femaleVoters: 19700,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-701',
          name: 'RS Puram Center',
          boothNo: 'CB-12',
          registeredVoters: 1100,
          votesCast: 720
        },
        {
          id: 'PS-702',
          name: 'Gandhipuram Hall',
          boothNo: 'CB-08',
          registeredVoters: 980,
          votesCast: 650
        }
      ],
      complaints: ['Additional signage requested.'],
      incidents: ['Brief power backup activated.'],
      notes: ['Smooth operations reported.']
    },
    {
      id: 'D-08',
      name: 'North Delhi',
      state: 'Delhi',
      phase: 'Phase 1',
      observer: 'Anjali Sharma',
      status: 'active',
      registeredVoters: 48500,
      maleVoters: 25200,
      femaleVoters: 23100,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-801',
          name: 'Model Town School',
          boothNo: 'ND-05',
          registeredVoters: 1250,
          votesCast: 890
        },
        {
          id: 'PS-802',
          name: 'Kamla Nagar Hall',
          boothNo: 'ND-11',
          registeredVoters: 1080,
          votesCast: 420
        }
      ],
      complaints: ['Parking space constraints.'],
      incidents: ['Managed crowd efficiently.'],
      notes: ['Security deployment adequate.']
    },
    {
      id: 'D-09',
      name: 'South Delhi',
      state: 'Delhi',
      phase: 'Phase 1',
      observer: 'Rahul Verma',
      status: 'active',
      registeredVoters: 51200,
      maleVoters: 26500,
      femaleVoters: 24500,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-901',
          name: 'Hauz Khas Center',
          boothNo: 'SD-03',
          registeredVoters: 1320,
          votesCast: 980
        },
        {
          id: 'PS-902',
          name: 'Greater Kailash School',
          boothNo: 'SD-07',
          registeredVoters: 1150,
          votesCast: 850
        }
      ],
      complaints: [],
      incidents: ['All systems operational.'],
      notes: ['High voter engagement observed.']
    },
    {
      id: 'D-10',
      name: 'Kolkata',
      state: 'West Bengal',
      phase: 'Phase 2',
      observer: 'Sourav Banerjee',
      status: 'active',
      registeredVoters: 46700,
      maleVoters: 23800,
      femaleVoters: 22700,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1001',
          name: 'Salt Lake Center',
          boothNo: 'KOL-09',
          registeredVoters: 1200,
          votesCast: 840
        },
        {
          id: 'PS-1002',
          name: 'Park Street Hall',
          boothNo: 'KOL-14',
          registeredVoters: 1050,
          votesCast: 680
        }
      ],
      complaints: ['Request for additional staff.'],
      incidents: ['Minor delay resolved.'],
      notes: ['Cultural engagement positively noted.']
    },
    {
      id: 'D-11',
      name: 'Howrah',
      state: 'West Bengal',
      phase: 'Phase 2',
      observer: 'Riya Das',
      status: 'active',
      registeredVoters: 41300,
      maleVoters: 21200,
      femaleVoters: 19900,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1101',
          name: 'Howrah Station Area Hall',
          boothNo: 'HWH-02',
          registeredVoters: 1080,
          votesCast: 720
        },
        {
          id: 'PS-1102',
          name: 'Shibpur Community Center',
          boothNo: 'HWH-08',
          registeredVoters: 950,
          votesCast: 610
        }
      ],
      complaints: ['Additional seating requested.'],
      incidents: [],
      notes: ['Observers patrol on schedule.']
    },
    {
      id: 'D-12',
      name: 'Ahmedabad',
      state: 'Gujarat',
      phase: 'Phase 1',
      observer: 'Jayesh Patel',
      status: 'active',
      registeredVoters: 49200,
      maleVoters: 25100,
      femaleVoters: 23900,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1201',
          name: 'Navrangpura Hall',
          boothNo: 'AMD-05',
          registeredVoters: 1280,
          votesCast: 920
        },
        {
          id: 'PS-1202',
          name: 'Satellite Area Center',
          boothNo: 'AMD-12',
          registeredVoters: 1140,
          votesCast: 790
        }
      ],
      complaints: [],
      incidents: ['All equipment functioning well.'],
      notes: ['Voter awareness campaigns effective.']
    },
    {
      id: 'D-13',
      name: 'Surat',
      state: 'Gujarat',
      phase: 'Phase 1',
      observer: 'Nisha Shah',
      status: 'active',
      registeredVoters: 44800,
      maleVoters: 22900,
      femaleVoters: 21700,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1301',
          name: 'Adajan Community Hall',
          boothNo: 'SRT-08',
          registeredVoters: 1150,
          votesCast: 810
        },
        {
          id: 'PS-1302',
          name: 'Vesu Center',
          boothNo: 'SRT-15',
          registeredVoters: 1020,
          votesCast: 670
        }
      ],
      complaints: ['Need better ventilation.'],
      incidents: [],
      notes: ['High compliance with protocols.']
    },
    {
      id: 'D-14',
      name: 'Jaipur',
      state: 'Rajasthan',
      phase: 'Phase 2',
      observer: 'Arjun Rathore',
      status: 'active',
      registeredVoters: 47600,
      maleVoters: 24300,
      femaleVoters: 23100,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1401',
          name: 'Malviya Nagar School',
          boothNo: 'JPR-04',
          registeredVoters: 1230,
          votesCast: 870
        },
        {
          id: 'PS-1402',
          name: 'Vaishali Nagar Hall',
          boothNo: 'JPR-09',
          registeredVoters: 1100,
          votesCast: 730
        }
      ],
      complaints: ['Drinking water supply to be increased.'],
      incidents: ['Minor technical glitch resolved.'],
      notes: ['Traditional voter engagement noted.']
    },
    {
      id: 'D-15',
      name: 'Jodhpur',
      state: 'Rajasthan',
      phase: 'Phase 2',
      observer: 'Meera Chauhan',
      status: 'active',
      registeredVoters: 38900,
      maleVoters: 19800,
      femaleVoters: 18900,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1501',
          name: 'Ratanada Center',
          boothNo: 'JDH-06',
          registeredVoters: 1050,
          votesCast: 720
        },
        {
          id: 'PS-1502',
          name: 'Paota Hall',
          boothNo: 'JDH-11',
          registeredVoters: 980,
          votesCast: 640
        }
      ],
      complaints: [],
      incidents: ['Smooth operations throughout.'],
      notes: ['Community participation excellent.']
    },
    {
      id: 'D-16',
      name: 'Lucknow',
      state: 'Uttar Pradesh',
      phase: 'Phase 1',
      observer: 'Aditya Mishra',
      status: 'active',
      registeredVoters: 53400,
      maleVoters: 27200,
      femaleVoters: 26000,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1601',
          name: 'Gomti Nagar School',
          boothNo: 'LKO-07',
          registeredVoters: 1400,
          votesCast: 980
        },
        {
          id: 'PS-1602',
          name: 'Hazratganj Center',
          boothNo: 'LKO-13',
          registeredVoters: 1250,
          votesCast: 850
        }
      ],
      complaints: ['Queue management can be improved.'],
      incidents: [],
      notes: ['High voter turnout expected.']
    },
    {
      id: 'D-17',
      name: 'Varanasi',
      state: 'Uttar Pradesh',
      phase: 'Phase 1',
      observer: 'Kavita Pandey',
      status: 'active',
      registeredVoters: 46200,
      maleVoters: 23700,
      femaleVoters: 22300,
      otherVoters: 200,
      pollingStations: [
        {
          id: 'PS-1701',
          name: 'Sigra Community Hall',
          boothNo: 'VNS-05',
          registeredVoters: 1180,
          votesCast: 820
        },
        {
          id: 'PS-1702',
          name: 'Lanka Area School',
          boothNo: 'VNS-10',
          registeredVoters: 1090,
          votesCast: 710
        }
      ],
      complaints: [],
      incidents: ['All procedures followed correctly.'],
      notes: ['Historic voter participation observed.']
    },
    {
      id: 'D-18',
      name: 'Amritsar',
      state: 'Punjab',
      phase: 'Phase 1',
      observer: 'Jaswant Singh',
      status: 'active',
      registeredVoters: 42300,
      maleVoters: 21800,
      femaleVoters: 20200,
      otherVoters: 300,
      pollingStations: [
        { id: 'PS-1801', name: 'Golden Temple Area Hall', boothNo: 'PB-01', registeredVoters: 1150, votesCast: 850 },
        { id: 'PS-1802', name: 'Cantonment School', boothNo: 'PB-04', registeredVoters: 1050, votesCast: 680 }
      ],
      complaints: ['Daytime aggregation in certain areas.'],
      incidents: [],
      notes: ['Community cooperation excellent.']
    },
    {
      id: 'D-19',
      name: 'Ludhiana',
      state: 'Punjab',
      phase: 'Phase 2',
      observer: 'Preet Kaur',
      status: 'active',
      registeredVoters: 48900,
      maleVoters: 25100,
      femaleVoters: 23500,
      otherVoters: 300,
      pollingStations: [
        { id: 'PS-1901', name: 'Model Town Center', boothNo: 'PB-08', registeredVoters: 1280, votesCast: 920 },
        { id: 'PS-1902', name: 'Civil Lines Hall', boothNo: 'PB-12', registeredVoters: 1100, votesCast: 750 }
      ],
      complaints: [],
      incidents: ['All protocols maintained.'],
      notes: ['Industrial area good participation.']
    },
    {
      id: 'D-20',
      name: 'Gurugram',
      state: 'Haryana',
      phase: 'Phase 1',
      observer: 'Vikram Sharma',
      status: 'active',
      registeredVoters: 51500,
      maleVoters: 26800,
      femaleVoters: 24500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2001', name: 'Sector 37 Center', boothNo: 'HR-01', registeredVoters: 1350, votesCast: 980 },
        { id: 'PS-2002', name: 'MG Road School', boothNo: 'HR-05', registeredVoters: 1200, votesCast: 840 }
      ],
      complaints: [],
      incidents: ['Tech-enabled polling stations functional.'],
      notes: ['High corporate participation.']
    },
    {
      id: 'D-21',
      name: 'Faridabad',
      state: 'Haryana',
      phase: 'Phase 2',
      observer: 'Meera Devi',
      status: 'active',
      registeredVoters: 43200,
      maleVoters: 22100,
      femaleVoters: 20900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2101', name: 'Industrial Area Hall', boothNo: 'HR-09', registeredVoters: 1120, votesCast: 760 },
        { id: 'PS-2102', name: 'City Center School', boothNo: 'HR-14', registeredVoters: 980, votesCast: 680 }
      ],
      complaints: ['Voter education pamphlets needed.'],
      incidents: [],
      notes: ['Smooth transport coordination.']
    },
    {
      id: 'D-22',
      name: 'Shimla',
      state: 'Himachal Pradesh',
      phase: 'Phase 1',
      observer: 'Anuj Thakur',
      status: 'active',
      registeredVoters: 35600,
      maleVoters: 18200,
      femaleVoters: 17100,
      otherVoters: 300,
      pollingStations: [
        { id: 'PS-2201', name: 'Ridge Area Center', boothNo: 'HP-02', registeredVoters: 1050, votesCast: 780 },
        { id: 'PS-2202', name: 'Kaithu School', boothNo: 'HP-07', registeredVoters: 920, votesCast: 620 }
      ],
      complaints: [],
      incidents: ['Mountainous terrain navigated well.'],
      notes: ['Weather conditions favorable.']
    },
    {
      id: 'D-23',
      name: 'Srinagar',
      state: 'Jammu and Kashmir',
      phase: 'Phase 2',
      observer: 'Hassan Khan',
      status: 'active',
      registeredVoters: 44800,
      maleVoters: 23100,
      femaleVoters: 21500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2301', name: 'Boulevard Center', boothNo: 'JK-03', registeredVoters: 1200, votesCast: 850 },
        { id: 'PS-2302', name: 'Lal Chowk Hall', boothNo: 'JK-06', registeredVoters: 1000, votesCast: 700 }
      ],
      complaints: ['Security coordination appreciated.'],
      incidents: [],
      notes: ['Religious sites properly managed.']
    },
    {
      id: 'D-24',
      name: 'Jammu',
      state: 'Jammu and Kashmir',
      phase: 'Phase 1',
      observer: 'Rajesh Verma',
      status: 'active',
      registeredVoters: 39200,
      maleVoters: 20100,
      femaleVoters: 18900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2401', name: 'Ragunath Bazar Hall', boothNo: 'JK-11', registeredVoters: 1080, votesCast: 740 },
        { id: 'PS-2402', name: 'Tawi Bridge Center', boothNo: 'JK-15', registeredVoters: 950, votesCast: 620 }
      ],
      complaints: [],
      incidents: ['Cross-LoC support functional.'],
      notes: ['Community harmony observed.']
    },
    {
      id: 'D-25',
      name: 'Dehradun',
      state: 'Uttarakhand',
      phase: 'Phase 1',
      observer: 'Priya Mishra',
      status: 'active',
      registeredVoters: 40500,
      maleVoters: 20800,
      femaleVoters: 19500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2501', name: 'Paltan Bazaar Hall', boothNo: 'UT-05', registeredVoters: 1100, votesCast: 800 },
        { id: 'PS-2502', name: 'Clement Town School', boothNo: 'UT-09', registeredVoters: 980, votesCast: 680 }
      ],
      complaints: [],
      incidents: ['Hill station logistics managed well.'],
      notes: ['Tourist participation included.']
    },
    {
      id: 'D-26',
      name: 'Bhubaneswar',
      state: 'Odisha',
      phase: 'Phase 1',
      observer: 'Sudeep Mohanty',
      status: 'active',
      registeredVoters: 46700,
      maleVoters: 23900,
      femaleVoters: 22600,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2601', name: 'Nayapalli Center', boothNo: 'OD-02', registeredVoters: 1200, votesCast: 870 },
        { id: 'PS-2602', name: 'Dharmasala School', boothNo: 'OD-08', registeredVoters: 1050, votesCast: 700 }
      ],
      complaints: [],
      incidents: ['Temple-area coordination smooth.'],
      notes: ['Heritage site protection noted.']
    },
    {
      id: 'D-27',
      name: 'Rourkela',
      state: 'Odisha',
      phase: 'Phase 2',
      observer: 'Ajay Singh',
      status: 'active',
      registeredVoters: 38200,
      maleVoters: 19600,
      femaleVoters: 18400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2701', name: 'Industrial Township Hall', boothNo: 'OD-12', registeredVoters: 1080, votesCast: 720 },
        { id: 'PS-2702', name: 'Sector 3 Center', boothNo: 'OD-16', registeredVoters: 950, votesCast: 630 }
      ],
      complaints: [],
      incidents: ['Steel plant workforce accommodated.'],
      notes: ['Shift-wise scheduling appreciated.']
    },
    {
      id: 'D-28',
      name: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      phase: 'Phase 1',
      observer: 'Raju Naidu',
      status: 'active',
      registeredVoters: 49300,
      maleVoters: 25200,
      femaleVoters: 23900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2801', name: 'Port Trust Hall', boothNo: 'AP-04', registeredVoters: 1280, votesCast: 920 },
        { id: 'PS-2802', name: 'Beach Road Center', boothNo: 'AP-07', registeredVoters: 1150, votesCast: 800 }
      ],
      complaints: [],
      incidents: ['Port area operations unaffected.'],
      notes: ['Maritime community participation.']
    },
    {
      id: 'D-29',
      name: 'Hyderabad',
      state: 'Telangana',
      phase: 'Phase 2',
      observer: 'Rajesh Reddy',
      status: 'active',
      registeredVoters: 52100,
      maleVoters: 26700,
      femaleVoters: 25200,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-2901', name: 'Banjara Hills Center', boothNo: 'TG-01', registeredVoters: 1350, votesCast: 1000 },
        { id: 'PS-2902', name: 'Secunderabad Hall', boothNo: 'TG-06', registeredVoters: 1200, votesCast: 850 }
      ],
      complaints: [],
      incidents: ['Tech hub engagement successful.'],
      notes: ['Largest voter participation state.']
    },
    {
      id: 'D-30',
      name: 'Kochi',
      state: 'Kerala',
      phase: 'Phase 1',
      observer: 'Deepti Nair',
      status: 'active',
      registeredVoters: 44200,
      maleVoters: 22300,
      femaleVoters: 21700,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3001', name: 'Fort Kochi Center', boothNo: 'KL-03', registeredVoters: 1150, votesCast: 880 },
        { id: 'PS-3002', name: 'Ernakulatom Hall', boothNo: 'KL-08', registeredVoters: 1050, votesCast: 740 }
      ],
      complaints: [],
      incidents: ['Backwater area logistics smooth.'],
      notes: ['High literacy engagement noted.']
    },
    {
      id: 'D-31',
      name: 'Thiruvananthapuram',
      state: 'Kerala',
      phase: 'Phase 1',
      observer: 'Anitha Raj',
      status: 'active',
      registeredVoters: 40800,
      maleVoters: 20600,
      femaleVoters: 20100,
      otherVoters: 100,
      pollingStations: [
        { id: 'PS-3101', name: 'Secretariat Area Center', boothNo: 'KL-12', registeredVoters: 1100, votesCast: 820 },
        { id: 'PS-3102', name: 'Pappanamcode Hall', boothNo: 'KL-15', registeredVoters: 980, votesCast: 700 }
      ],
      complaints: [],
      incidents: ['Coastal area navigation effective.'],
      notes: ['Women voter turnout highest.']
    },
    {
      id: 'D-32',
      name: 'Ranchi',
      state: 'Jharkhand',
      phase: 'Phase 1',
      observer: 'Arjun Yadav',
      status: 'active',
      registeredVoters: 41500,
      maleVoters: 21300,
      femaleVoters: 20000,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3201', name: 'Upper Bazar Center', boothNo: 'JH-05', registeredVoters: 1120, votesCast: 800 },
        { id: 'PS-3202', name: 'Hindpiri Hall', boothNo: 'JH-09', registeredVoters: 1020, votesCast: 680 }
      ],
      complaints: ['Tribal area accessibility improved.'],
      incidents: [],
      notes: ['Mining region participation good.']
    },
    {
      id: 'D-33',
      name: 'Patna',
      state: 'Bihar',
      phase: 'Phase 2',
      observer: 'Amitabh Singh',
      status: 'active',
      registeredVoters: 48600,
      maleVoters: 24800,
      femaleVoters: 23600,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3301', name: 'Gardenia Center', boothNo: 'BR-02', registeredVoters: 1280, votesCast: 900 },
        { id: 'PS-3302', name: 'Gandhi Maidan Hall', boothNo: 'BR-07', registeredVoters: 1150, votesCast: 750 }
      ],
      complaints: [],
      incidents: ['Ganga corridor properly secured.'],
      notes: ['Historical site engagement positive.']
    },
    {
      id: 'D-34',
      name: 'Gaya',
      state: 'Bihar',
      phase: 'Phase 1',
      observer: 'Bhavna Sharma',
      status: 'active',
      registeredVoters: 39800,
      maleVoters: 20200,
      femaleVoters: 19400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3401', name: 'Vishnupad Temple Area', boothNo: 'BR-11', registeredVoters: 1050, votesCast: 750 },
        { id: 'PS-3402', name: 'South Gaya Center', boothNo: 'BR-14', registeredVoters: 950, votesCast: 620 }
      ],
      complaints: [],
      incidents: ['Pilgrimage season coordination excellent.'],
      notes: ['Rural participation exceeding targets.']
    },
    {
      id: 'D-35',
      name: 'Indore',
      state: 'Madhya Pradesh',
      phase: 'Phase 1',
      observer: 'Kapil Verma',
      status: 'active',
      registeredVoters: 47200,
      maleVoters: 24100,
      femaleVoters: 22900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3501', name: 'Rajwada Center', boothNo: 'MP-01', registeredVoters: 1220, votesCast: 870 },
        { id: 'PS-3502', name: 'Khajrana Hall', boothNo: 'MP-06', registeredVoters: 1100, votesCast: 740 }
      ],
      complaints: [],
      incidents: ['Cleanliness drive successful.'],
      notes: ['Cleanest city voter participation.']
    },
    {
      id: 'D-36',
      name: 'Bhopal',
      state: 'Madhya Pradesh',
      phase: 'Phase 2',
      observer: 'Neelam Singh',
      status: 'active',
      registeredVoters: 44900,
      maleVoters: 23000,
      femaleVoters: 21800,
      otherVoters: 100,
      pollingStations: [
        { id: 'PS-3601', name: 'Arera Hills Center', boothNo: 'MP-09', registeredVoters: 1180, votesCast: 820 },
        { id: 'PS-3602', name: 'Hoshangabad Hall', boothNo: 'MP-13', registeredVoters: 1050, votesCast: 700 }
      ],
      complaints: [],
      incidents: ['Lake-area protection maintained.'],
      notes: ['Disaster preparedness coordination noted.']
    },
    {
      id: 'D-37',
      name: 'Raipur',
      state: 'Chhattisgarh',
      phase: 'Phase 1',
      observer: 'Devendra Tiwari',
      status: 'active',
      registeredVoters: 42300,
      maleVoters: 21700,
      femaleVoters: 20400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3701', name: 'Civil Lines Center', boothNo: 'CG-03', registeredVoters: 1120, votesCast: 800 },
        { id: 'PS-3702', name: 'Pandri Hall', boothNo: 'CG-07', registeredVoters: 1020, votesCast: 680 }
      ],
      complaints: [],
      incidents: ['Steel city operations smooth.'],
      notes: ['Mining region engagement good.']
    },
    {
      id: 'D-38',
      name: 'Panaji',
      state: 'Goa',
      phase: 'Phase 2',
      observer: 'Vanessa Fernandes',
      status: 'active',
      registeredVoters: 35200,
      maleVoters: 17900,
      femaleVoters: 17100,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3801', name: 'Fountain Area Center', boothNo: 'GA-02', registeredVoters: 950, votesCast: 720 },
        { id: 'PS-3802', name: 'Altinho Hall', boothNo: 'GA-05', registeredVoters: 850, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Tourist area management effective.'],
      notes: ['Beach access coordination successful.']
    },
    {
      id: 'D-39',
      name: 'Guwahati',
      state: 'Assam',
      phase: 'Phase 1',
      observer: 'Bijoy Dutta',
      status: 'active',
      registeredVoters: 45600,
      maleVoters: 23200,
      femaleVoters: 22200,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-3901', name: 'Guwahati High School Area', boothNo: 'AS-01', registeredVoters: 1200, votesCast: 850 },
        { id: 'PS-3902', name: 'Dispur Center', boothNo: 'AS-04', registeredVoters: 1050, votesCast: 700 }
      ],
      complaints: [],
      incidents: ['Brahmaputra crossing secured.'],
      notes: ['Tea garden worker participation good.']
    },
    {
      id: 'D-40',
      name: 'Shillong',
      state: 'Meghalaya',
      phase: 'Phase 1',
      observer: 'Patricia Khongsan',
      status: 'active',
      registeredVoters: 38900,
      maleVoters: 19800,
      femaleVoters: 18900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4001', name: 'Police Bazaar Center', boothNo: 'MG-02', registeredVoters: 1050, votesCast: 780 },
        { id: 'PS-4002', name: 'Laitumkhrah Hall', boothNo: 'MG-06', registeredVoters: 920, votesCast: 620 }
      ],
      complaints: [],
      incidents: ['Hilly terrain navigation effective.'],
      notes: ['Tribal engagement excellent.']
    },
    {
      id: 'D-41',
      name: 'Agartala',
      state: 'Tripura',
      phase: 'Phase 2',
      observer: 'Somnath Roy',
      status: 'active',
      registeredVoters: 36800,
      maleVoters: 18700,
      femaleVoters: 18000,
      otherVoters: 100,
      pollingStations: [
        { id: 'PS-4101', name: 'Ujjayanta Palace Area', boothNo: 'TR-03', registeredVoters: 1000, votesCast: 720 },
        { id: 'PS-4102', name: 'College Tilla Hall', boothNo: 'TR-07', registeredVoters: 900, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Border-area coordination smooth.'],
      notes: ['Peace-building participation positive.']
    },
    {
      id: 'D-42',
      name: 'Imphal',
      state: 'Manipur',
      phase: 'Phase 1',
      observer: 'Lalit Kumar Singh',
      status: 'active',
      registeredVoters: 37500,
      maleVoters: 19100,
      femaleVoters: 18200,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4201', name: 'Loktak Lake Area', boothNo: 'MN-02', registeredVoters: 1020, votesCast: 740 },
        { id: 'PS-4202', name: 'Palace Compound Center', boothNo: 'MN-05', registeredVoters: 920, votesCast: 630 }
      ],
      complaints: [],
      incidents: ['Lake-area preservation successful.'],
      notes: ['Cultural harmony observed.']
    },
    {
      id: 'D-43',
      name: 'Aizawl',
      state: 'Mizoram',
      phase: 'Phase 2',
      observer: 'Zoramthara Mizo',
      status: 'active',
      registeredVoters: 33200,
      maleVoters: 16900,
      femaleVoters: 16100,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4301', name: 'Chaltlang Center', boothNo: 'MZ-01', registeredVoters: 920, votesCast: 680 },
        { id: 'PS-4302', name: 'Kumtheiral Hall', boothNo: 'MZ-04', registeredVoters: 820, votesCast: 550 }
      ],
      complaints: [],
      incidents: ['Mountain region operations smooth.'],
      notes: ['Community harmony excellent.']
    },
    {
      id: 'D-44',
      name: 'Kohima',
      state: 'Nagaland',
      phase: 'Phase 1',
      observer: 'Vino Wangshe',
      status: 'active',
      registeredVoters: 32100,
      maleVoters: 16300,
      femaleVoters: 15700,
      otherVoters: 100,
      pollingStations: [
        { id: 'PS-4401', name: 'Kezado Square Center', boothNo: 'NL-02', registeredVoters: 880, votesCast: 640 },
        { id: 'PS-4402', name: 'Four Point Hall', boothNo: 'NL-05', registeredVoters: 800, votesCast: 530 }
      ],
      complaints: [],
      incidents: ['Tribal council coordination smooth.'],
      notes: ['Clan-based voting patterns noted.']
    },
    {
      id: 'D-45',
      name: 'Itanagar',
      state: 'Arunachal Pradesh',
      phase: 'Phase 2',
      observer: 'Prem Singh',
      status: 'active',
      registeredVoters: 34800,
      maleVoters: 17700,
      femaleVoters: 16900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4501', name: 'Secretariat Area Center', boothNo: 'AR-01', registeredVoters: 950, votesCast: 700 },
        { id: 'PS-4502', name: 'Naharlagun Hall', boothNo: 'AR-04', registeredVoters: 850, votesCast: 580 }
      ],
      complaints: [],
      incidents: ['Border-area security maintained.'],
      notes: ['Remote area logistics effective.']
    },
    {
      id: 'D-46',
      name: 'Pune',
      state: 'Maharashtra',
      phase: 'Phase 2',
      observer: 'Shreya Desai',
      status: 'active',
      registeredVoters: 50200,
      maleVoters: 25600,
      femaleVoters: 24300,
      otherVoters: 300,
      pollingStations: [
        { id: 'PS-4601', name: 'Kalyani Nagar Center', boothNo: 'MH-16', registeredVoters: 1320, votesCast: 950 },
        { id: 'PS-4602', name: 'Aundh Hall', boothNo: 'MH-20', registeredVoters: 1200, votesCast: 820 }
      ],
      complaints: [],
      incidents: ['Tech hub polling well-coordinated.'],
      notes: ['Education sector participation strong.']
    },
    {
      id: 'D-47',
      name: 'Nagpur',
      state: 'Maharashtra',
      phase: 'Phase 1',
      observer: 'Vikrant Joshi',
      status: 'active',
      registeredVoters: 44500,
      maleVoters: 22700,
      femaleVoters: 21600,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4701', name: 'South Nagpur Center', boothNo: 'MH-24', registeredVoters: 1150, votesCast: 810 },
        { id: 'PS-4702', name: 'Sitabuldi Hall', boothNo: 'MH-28', registeredVoters: 1050, votesCast: 720 }
      ],
      complaints: [],
      incidents: ['Orange city logistics smooth.'],
      notes: ['Agricultural community engagement good.']
    },
    {
      id: 'D-48',
      name: 'Bengaluru',
      state: 'Karnataka',
      phase: 'Phase 1',
      observer: 'Roshan Kumar',
      status: 'active',
      registeredVoters: 56700,
      maleVoters: 29000,
      femaleVoters: 27500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4801', name: 'Whitefield Center', boothNo: 'KA-18', registeredVoters: 1450, votesCast: 1050 },
        { id: 'PS-4802', name: 'Indiranagar Hall', boothNo: 'KA-22', registeredVoters: 1300, votesCast: 900 }
      ],
      complaints: [],
      incidents: ['IT park elections successful.'],
      notes: ['Startup hub participation excellent.']
    },
    {
      id: 'D-49',
      name: 'Mysore',
      state: 'Karnataka',
      phase: 'Phase 2',
      observer: 'Ramesh Gowda',
      status: 'active',
      registeredVoters: 39800,
      maleVoters: 20300,
      femaleVoters: 19300,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-4901', name: 'Agrahara Center', boothNo: 'KA-26', registeredVoters: 1080, votesCast: 760 },
        { id: 'PS-4902', name: 'Jayalakshmipuram Hall', boothNo: 'KA-30', registeredVoters: 950, votesCast: 650 }
      ],
      complaints: [],
      incidents: ['Palace city heritage protected.'],
      notes: ['Temple district coordination smooth.']
    },
    {
      id: 'D-50',
      name: 'Madurai',
      state: 'Tamil Nadu',
      phase: 'Phase 1',
      observer: 'Geetha Iyer',
      status: 'active',
      registeredVoters: 41200,
      maleVoters: 21000,
      femaleVoters: 20000,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5001', name: 'Meenakshi Temple Area', boothNo: 'TN-16', registeredVoters: 1100, votesCast: 800 },
        { id: 'PS-5002', name: 'Anna Nagar Center', boothNo: 'TN-20', registeredVoters: 1000, votesCast: 680 }
      ],
      complaints: [],
      incidents: ['Temple coordination excellent.'],
      notes: ['Pilgrimage season management noted.']
    },
    {
      id: 'D-51',
      name: 'Salem',
      state: 'Tamil Nadu',
      phase: 'Phase 2',
      observer: 'Anand Kumar',
      status: 'active',
      registeredVoters: 37900,
      maleVoters: 19300,
      femaleVoters: 18400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5101', name: 'Town Hall Center', boothNo: 'TN-24', registeredVoters: 1020, votesCast: 700 },
        { id: 'PS-5102', name: 'Ram Nagar Hall', boothNo: 'TN-28', registeredVoters: 920, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Industrial area security maintained.'],
      notes: ['Textile industry workers participated.']
    },
    {
      id: 'D-52',
      name: 'New Delhi',
      state: 'Delhi',
      phase: 'Phase 1',
      observer: 'Pooja Gupta',
      status: 'active',
      registeredVoters: 49800,
      maleVoters: 25500,
      femaleVoters: 24000,
      otherVoters: 300,
      pollingStations: [
        { id: 'PS-5201', name: 'India Gate Area Center', boothNo: 'DL-19', registeredVoters: 1300, votesCast: 950 },
        { id: 'PS-5202', name: 'Connaught Place Hall', boothNo: 'DL-23', registeredVoters: 1150, votesCast: 800 }
      ],
      complaints: [],
      incidents: ['Central zone security tight.'],
      notes: ['Tourist participation managed.']
    },
    {
      id: 'D-53',
      name: 'East Delhi',
      state: 'Delhi',
      phase: 'Phase 2',
      observer: 'Arun Deshmukh',
      status: 'active',
      registeredVoters: 46200,
      maleVoters: 23600,
      femaleVoters: 22400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5301', name: 'Preet Vihar Center', boothNo: 'DL-27', registeredVoters: 1200, votesCast: 850 },
        { id: 'PS-5302', name: 'Seema Puri Hall', boothNo: 'DL-31', registeredVoters: 1100, votesCast: 750 }
      ],
      complaints: [],
      incidents: ['Industrial area operations smooth.'],
      notes: ['Worker participation strong.']
    },
    {
      id: 'D-54',
      name: 'Darjeeling',
      state: 'West Bengal',
      phase: 'Phase 1',
      observer: 'Tenzin Norbu',
      status: 'active',
      registeredVoters: 32500,
      maleVoters: 16800,
      femaleVoters: 15500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5401', name: 'Chowrasta Center', boothNo: 'WB-19', registeredVoters: 900, votesCast: 650 },
        { id: 'PS-5402', name: 'Kalimpong Hall', boothNo: 'WB-23', registeredVoters: 800, votesCast: 540 }
      ],
      complaints: [],
      incidents: ['Hill station logistics effective.'],
      notes: ['Tea garden worker participation.']
    },
    {
      id: 'D-55',
      name: 'Durgapur',
      state: 'West Bengal',
      phase: 'Phase 2',
      observer: 'Subir Chatterjee',
      status: 'active',
      registeredVoters: 40100,
      maleVoters: 20500,
      femaleVoters: 19400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5501', name: 'Industrial Township Center', boothNo: 'WB-27', registeredVoters: 1080, votesCast: 740 },
        { id: 'PS-5502', name: 'Town Hall Hall', boothNo: 'WB-31', registeredVoters: 950, votesCast: 630 }
      ],
      complaints: [],
      incidents: ['Steel plant coordination smooth.'],
      notes: ['Manufacturing sector participation good.']
    },
    {
      id: 'D-56',
      name: 'Vadodara',
      state: 'Gujarat',
      phase: 'Phase 1',
      observer: 'Rajesh Patel',
      status: 'active',
      registeredVoters: 43200,
      maleVoters: 22100,
      femaleVoters: 20900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5601', name: 'Fatehganj Center', boothNo: 'GJ-18', registeredVoters: 1120, votesCast: 800 },
        { id: 'PS-5602', name: 'Makarpura Hall', boothNo: 'GJ-22', registeredVoters: 1000, votesCast: 670 }
      ],
      complaints: [],
      incidents: ['Textile operations unaffected.'],
      notes: ['Cultural participation noted.']
    },
    {
      id: 'D-57',
      name: 'Rajkot',
      state: 'Gujarat',
      phase: 'Phase 2',
      observer: 'Harsh Mehta',
      status: 'active',
      registeredVoters: 38900,
      maleVoters: 19800,
      femaleVoters: 18900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5701', name: 'Dharmaj Center', boothNo: 'GJ-26', registeredVoters: 1050, votesCast: 720 },
        { id: 'PS-5702', name: 'Jetpur Hall', boothNo: 'GJ-30', registeredVoters: 920, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Industrial area management good.'],
      notes: ['Gem polishing sector engaged.']
    },
    {
      id: 'D-58',
      name: 'Udaipur',
      state: 'Rajasthan',
      phase: 'Phase 1',
      observer: 'Mayank Singh',
      status: 'active',
      registeredVoters: 36500,
      maleVoters: 18700,
      femaleVoters: 17600,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5801', name: 'City Palace Area Center', boothNo: 'RJ-18', registeredVoters: 1000, votesCast: 730 },
        { id: 'PS-5802', name: 'Fateh Sagar Hall', boothNo: 'RJ-22', registeredVoters: 900, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Lake city preservation noted.'],
      notes: ['Tourism-dependent sector managed.']
    },
    {
      id: 'D-59',
      name: 'Bikaner',
      state: 'Rajasthan',
      phase: 'Phase 2',
      observer: 'Harish Bhat',
      status: 'active',
      registeredVoters: 33200,
      maleVoters: 16900,
      femaleVoters: 16100,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-5901', name: 'Junagarh Area Center', boothNo: 'RJ-26', registeredVoters: 920, votesCast: 650 },
        { id: 'PS-5902', name: 'Deshok Hall', boothNo: 'RJ-30', registeredVoters: 820, votesCast: 540 }
      ],
      complaints: [],
      incidents: ['Desert region logistics effective.'],
      notes: ['Camel breeding sector satisfied.']
    },
    {
      id: 'D-60',
      name: 'Kanpur',
      state: 'Uttar Pradesh',
      phase: 'Phase 1',
      observer: 'Suresh Kumar',
      status: 'active',
      registeredVoters: 45300,
      maleVoters: 23200,
      femaleVoters: 21900,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6001', name: 'Unnao Center', boothNo: 'UP-18', registeredVoters: 1200, votesCast: 840 },
        { id: 'PS-6002', name: 'Jajmau Hall', boothNo: 'UP-22', registeredVoters: 1050, votesCast: 700 }
      ],
      complaints: [],
      incidents: ['Tanning operations coordinated.'],
      notes: ['Manufacturing sector participation good.']
    },
    {
      id: 'D-61',
      name: 'Agra',
      state: 'Uttar Pradesh',
      phase: 'Phase 2',
      observer: 'Neha Singh',
      status: 'active',
      registeredVoters: 42800,
      maleVoters: 21900,
      femaleVoters: 20700,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6101', name: 'Taj Ganj Center', boothNo: 'UP-26', registeredVoters: 1150, votesCast: 830 },
        { id: 'PS-6102', name: 'Sadar Hall', boothNo: 'UP-30', registeredVoters: 1000, votesCast: 680 }
      ],
      complaints: [],
      incidents: ['Heritage site protected.'],
      notes: ['Tourism sector well-managed.']
    },
    {
      id: 'D-62',
      name: 'Chandigarh',
      state: 'Punjab',
      phase: 'Phase 1',
      observer: 'Harpreet Kaur',
      status: 'active',
      registeredVoters: 46700,
      maleVoters: 24000,
      femaleVoters: 22500,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6201', name: 'Sector 17 Center', boothNo: 'PB-17', registeredVoters: 1250, votesCast: 900 },
        { id: 'PS-6202', name: 'Elante Mall Area Hall', boothNo: 'PB-21', registeredVoters: 1100, votesCast: 760 }
      ],
      complaints: [],
      incidents: ['Planned city operations smooth.'],
      notes: ['Educated electorate participation high.']
    },
    {
      id: 'D-63',
      name: 'Patiala',
      state: 'Punjab',
      phase: 'Phase 2',
      observer: 'Karanvir Singh',
      status: 'active',
      registeredVoters: 39600,
      maleVoters: 20200,
      femaleVoters: 19200,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6301', name: 'Baradari Center', boothNo: 'PB-25', registeredVoters: 1070, votesCast: 740 },
        { id: 'PS-6302', name: 'Nabha Gate Hall', boothNo: 'PB-29', registeredVoters: 950, votesCast: 620 }
      ],
      complaints: [],
      incidents: ['Palace city coordination good.'],
      notes: ['Agricultural community engaged.']
    },
    {
      id: 'D-64',
      name: 'Panipat',
      state: 'Haryana',
      phase: 'Phase 1',
      observer: 'Mohan Lal',
      status: 'active',
      registeredVoters: 40200,
      maleVoters: 20600,
      femaleVoters: 19400,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6401', name: 'Samalkha Center', boothNo: 'HR-19', registeredVoters: 1100, votesCast: 770 },
        { id: 'PS-6402', name: 'Ranipur Gate Hall', boothNo: 'HR-23', registeredVoters: 980, votesCast: 650 }
      ],
      complaints: [],
      incidents: ['Industrial area management smooth.'],
      notes: ['Textile sector participation good.']
    },
    {
      id: 'D-65',
      name: 'Hisar',
      state: 'Haryana',
      phase: 'Phase 2',
      observer: 'Rajendra Singh',
      status: 'active',
      registeredVoters: 37800,
      maleVoters: 19300,
      femaleVoters: 18300,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6501', name: 'Civil Lines Center', boothNo: 'HR-27', registeredVoters: 1010, votesCast: 690 },
        { id: 'PS-6502', name: 'Subash Nagar Hall', boothNo: 'HR-31', registeredVoters: 900, votesCast: 580 }
      ],
      complaints: [],
      incidents: ['Agricultural operations unaffected.'],
      notes: ['Farming community participation noted.']
    },
    {
      id: 'D-66',
      name: 'Mangalore',
      state: 'Karnataka',
      phase: 'Phase 1',
      observer: 'Rajesh Rao',
      status: 'active',
      registeredVoters: 41600,
      maleVoters: 21300,
      femaleVoters: 20100,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6601', name: 'Port Authority Center', boothNo: 'KA-34', registeredVoters: 1120, votesCast: 800 },
        { id: 'PS-6602', name: 'Hampankatta Hall', boothNo: 'KA-38', registeredVoters: 980, votesCast: 650 }
      ],
      complaints: [],
      incidents: ['Port operations coordination smooth.'],
      notes: ['Fishing community engagement good.']
    },
    {
      id: 'D-67',
      name: 'Erode',
      state: 'Tamil Nadu',
      phase: 'Phase 1',
      observer: 'Selva Kumar',
      status: 'active',
      registeredVoters: 39400,
      maleVoters: 20100,
      femaleVoters: 19100,
      otherVoters: 200,
      pollingStations: [
        { id: 'PS-6701', name: 'Peruvemba Center', boothNo: 'TN-32', registeredVoters: 1050, votesCast: 720 },
        { id: 'PS-6702', name: 'Appakonda Hall', boothNo: 'TN-36', registeredVoters: 920, votesCast: 600 }
      ],
      complaints: [],
      incidents: ['Textile industry operations smooth.'],
      notes: ['Industrial worker participation good.']
    }
  ]);

  const profileDetails = useMemo(() => ({
    name: 'Aarav Mehta',
    role: 'Election Observer',
    email: 'observer@election.gov',
    phone: '+91 90000 00000',
    assignedDistricts: ['Downtown District', 'North Zone'],
    lastLogin: 'Feb 26, 2026 • 08:40 AM'
  }), []);

  const selectedDistrict = useMemo(
    () => districts.find(district => district.id === selectedDistrictId) || districts[0],
    [districts, selectedDistrictId]
  );

  const stateOptions = useMemo(() => {
    return Array.from(new Set(districts.map(district => district.state)));
  }, [districts]);

  const districtsByState = useMemo(() => {
    return districts.filter(district => district.state === selectedState);
  }, [districts, selectedState]);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    const districtMatches = districtsByState
      .filter(district => district.name.toLowerCase().includes(lower))
      .map(district => ({
        id: district.id,
        label: district.name,
        type: 'district',
        districtId: district.id
      }));

    const stationMatches = districtsByState.flatMap(district =>
      district.pollingStations
        .filter(station => station.name.toLowerCase().includes(lower))
        .map(station => ({
          id: station.id,
          label: station.name,
          type: 'station',
          districtId: district.id,
          stationId: station.id
        }))
    );

    return [...districtMatches, ...stationMatches].slice(0, 8);
  }, [districtsByState, searchTerm]);

  useEffect(() => {
    if (!selectedDistrict) return;

    const interval = setInterval(() => {
      setDistricts(prev => prev.map(district => {
        if (district.id !== selectedDistrict.id || district.status !== 'active') {
          return district;
        }

        const updatedStations = district.pollingStations.map(station => {
          const increment = Math.floor(Math.random() * 6);
          const votesCast = Math.min(station.votesCast + increment, station.registeredVoters);
          return { ...station, votesCast };
        });

        return { ...district, pollingStations: updatedStations };
      }));
      setLastUpdated(new Date());
    }, 12000);

    return () => clearInterval(interval);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedStationId(null);
  }, [selectedDistrictId]);

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.label);
    setSelectedDistrictId(suggestion.districtId);
    if (suggestion.type === 'station') {
      setSelectedStationId(suggestion.stationId);
    }
  };

  const handleSearchSubmit = () => {
    if (suggestions.length > 0) {
      handleSelectSuggestion(suggestions[0]);
    }
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrictId(districtId);
    const selected = districtsByState.find(district => district.id === districtId);
    setSearchTerm(selected ? selected.name : '');
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    const firstDistrict = districts.find(district => district.state === state);
    if (firstDistrict) {
      setSelectedDistrictId(firstDistrict.id);
      setSearchTerm(firstDistrict.name);
    }
  };

  const districtStats = useMemo(() => {
    const totalVotesCast = selectedDistrict.pollingStations.reduce(
      (sum, station) => sum + station.votesCast,
      0
    );
    const totalRegistered = selectedDistrict.registeredVoters;
    const totalNotVoted = Math.max(totalRegistered - totalVotesCast, 0);
    const turnoutPercentage = totalRegistered > 0
      ? Math.round((totalVotesCast / totalRegistered) * 100)
      : 0;

    return {
      totalRegistered,
      totalVotesCast,
      totalNotVoted,
      turnoutPercentage,
      maleVoters: selectedDistrict.maleVoters,
      femaleVoters: selectedDistrict.femaleVoters,
      otherVoters: selectedDistrict.otherVoters
    };
  }, [selectedDistrict]);

  const alerts = useMemo(() => {
    return selectedDistrict.pollingStations
      .filter(station => {
        const turnout = station.registeredVoters
          ? (station.votesCast / station.registeredVoters) * 100
          : 0;
        return turnout < 40 && selectedDistrict.status === 'active';
      })
      .map(station => `${station.name} turnout below 40%.`);
  }, [selectedDistrict]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/');
    }
  };

  return (
    <div className="observer-dashboard district-dashboard">
      <header className="portal-header">
        <div className="header-left">
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 9 12 L 11 14 L 15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="header-info">
            <h1 className="header-title">Election Monitoring System</h1>
            <p className="header-subtitle">District Observer Command Center</p>
          </div>
        </div>

        <div className="header-right">
          <button className="profile-btn" onClick={() => setProfileOpen(true)} title="Profile">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path d="M 12 14 C 9 14 3 15.34 3 18 L 3 20 L 21 20 L 21 18 C 21 15.34 15 14 12 14 Z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="portal-main">
        <div className="portal-container district-layout">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearchSubmit}
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            states={stateOptions}
            selectedState={selectedState}
            onStateChange={handleStateChange}
            districts={districtsByState}
            selectedDistrictId={selectedDistrictId}
            onDistrictChange={handleDistrictChange}
          />

          <nav className="district-menu-bar">
            <button
              className={`menu-tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3h7v9H3V3zm11 0h7v5h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Districts Analysis and Breakdown</span>
            </button>
            <button
              className={`menu-tab ${activeTab === 'transparency' ? 'active' : ''}`}
              onClick={() => setActiveTab('transparency')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Transparency and Monitoring</span>
            </button>
          </nav>

          {activeTab === 'analysis' && (
            <>
              <DistrictOverview
                district={selectedDistrict}
                lastUpdated={lastUpdated}
              />

              <StatisticsCards stats={districtStats} />

              <div className="district-grid">
                <div className="district-left">
                  <StationTable
                    stations={selectedDistrict.pollingStations}
                    selectedStationId={selectedStationId}
                  />
                  <ChartsSection
                    stats={districtStats}
                    stations={selectedDistrict.pollingStations}
                    districtName={selectedDistrict.name}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'transparency' && (
            <div className="transparency-full-view">
              <TransparencyPanel
                complaints={selectedDistrict.complaints}
                incidents={selectedDistrict.incidents}
                notes={selectedDistrict.notes}
                alerts={alerts}
              />
            </div>
          )}
        </div>
      </main>

      {profileOpen && (
        <div className="profile-modal-overlay" onClick={() => setProfileOpen(false)}>
          <div className="profile-modal" onClick={(event) => event.stopPropagation()}>
            <div className="profile-modal-header">
              <div>
                <h3 className="profile-title">Observer Profile</h3>
                <p className="profile-subtitle">Your account details and assignment</p>
              </div>
              <button className="profile-close" onClick={() => setProfileOpen(false)} aria-label="Close profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-summary">
                <div className="profile-avatar">AM</div>
                <div>
                  <h4>{profileDetails.name}</h4>
                  <span className="profile-role">{profileDetails.role}</span>
                </div>
              </div>

              <div className="profile-grid">
                <div className="profile-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{profileDetails.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Phone</span>
                  <span className="profile-value">{profileDetails.phone}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Assigned Districts</span>
                  <span className="profile-value">{profileDetails.assignedDistricts.join(', ')}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Last Login</span>
                  <span className="profile-value">{profileDetails.lastLogin}</span>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button className="profile-secondary" onClick={() => setProfileOpen(false)}>
                Close
              </button>
              <button className="profile-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DistrictObserverDashboard;
