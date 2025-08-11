import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable, TextInput, FlatList, StyleSheet, Alert, ScrollView, Image } from "react-native";

// Preloaded lists
const DRIVERS = ["Josh", "Jack", "Jeremy", "Dewey"];
const TRUCKS = ["2010 International","2000 Kenworth","1994 Kenworth","2003 Sterling Tandem"];
const CUSTOMERS = ["CCC","Windish","Trotter"];
const MATERIALS = ["rock","sand","dirt"];
const PICKUPS = ["Quarry A","Quarry B","Yard C"];

const theme = { orange:"#F5821E", white:"#FFF", border:"#E3E3E3", pad:n=>n*8 };
const pad2 = n => String(n).padStart(2,"0");
const fmt = ts => { if(!ts) return ""; const d=new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const toCSV = trips => ["Driver,Truck,Customer,Material,Pickup,Delivery,Start Odo,Start,End", ...trips.map(t=>[
  t.driver,t.truck,t.customer,t.material,t.pickup,(t.delivery||"").replace(/,/g,";"),t.odom||"",fmt(t.startedAt),fmt(t.endedAt)
].join(","))].join("\n");

export default function App(){
  const [driver,setDriver]=useState(DRIVERS[0]);
  const [truck,setTruck]=useState(TRUCKS[0]);
  const [customer,setCustomer]=useState(CUSTOMERS[0]);
  const [material,setMaterial]=useState(MATERIALS[0]);
  const [pickup,setPickup]=useState(PICKUPS[0]);
  const [delivery,setDelivery]=useState("");
  const [odom,setOdom]=useState("");
  const [startedAt,setStartedAt]=useState(null);
  const [trips,setTrips]=useState([]);
  const [view,setView]=useState("form"); // form | list | csv
  const [csv,setCsv]=useState("");

  const startTrip=()=>{ if(!odom.trim()) return Alert.alert("Starting odometer required"); setStartedAt(Date.now()); };
  const endTrip=()=>{ if(!startedAt) return Alert.alert("Start the trip first");
    const t={ id:String(Math.random()).slice(2), driver,truck,customer,material,pickup,delivery:delivery.trim(),odom:odom.trim(),startedAt,endedAt:Date.now() };
    setTrips(prev=>[t,...prev]); setDelivery(""); setOdom(""); setStartedAt(null); Alert.alert("Trip saved","You can start the next trip.");
  };
  const buildCSV=()=>{ setCsv(toCSV(trips)); setView("csv"); };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:theme.white}}>
      <Header />
      <Nav view={view} setView={setView}/>
      {view==="form" && (
        <ScrollView contentContainerStyle={{padding:theme.pad(2),paddingBottom:theme.pad(4)}}>
          <Title text="New Trip"/>
          <PickerLike label="Driver" value={driver} options={DRIVERS} onChange={setDriver}/>
          <PickerLike label="Truck" value={truck} options={TRUCKS} onChange={setTruck}/>
          <PickerLike label="Customer" value={customer} options={CUSTOMERS} onChange={setCustomer}/>
          <PickerLike label="Material" value={material} options={MATERIALS} onChange={setMaterial}/>
          <PickerLike label="Pickup Location" value={pickup} options={PICKUPS} onChange={setPickup}/>
          <Label text="Delivery Location (free text)"/>
          <TextInput style={styles.input} placeholder="Job site / address" value={delivery} onChangeText={setDelivery}/>
          <Label text="Starting Odometer"/>
          <TextInput style={styles.input} placeholder="e.g. 123456" keyboardType="numeric" value={odom} onChangeText={setOdom}/>
          <View style={{flexDirection:"row",gap:theme.pad(1),marginTop:theme.pad(2)}}>
            <Pressable onPress={startTrip} style={[styles.btn, styles.btnHollow]}>
              <Text style={[styles.btnText, { color: theme.orange }]}>
                {startedAt ? `Started ✓ (${new Date(startedAt).toLocaleTimeString()})` : "Start Trip"}
              </Text>
            </Pressable>
            <Pressable onPress={endTrip} style={[styles.btn, styles.btnSolid]}>
              <Text style={[styles.btnText, { color: theme.white }]}>End Trip</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
      {view==="list" && (
        <View style={{flex:1}}>
          <Title text="Today's Trips"/>
          <FlatList
            contentContainerStyle={{padding:theme.pad(2)}}
            data={trips}
            keyExtractor={(t)=>t.id}
            ListEmptyComponent={<Text style={{textAlign:"center",marginTop:theme.pad(4)}}>No trips yet.</Text>}
            renderItem={({item})=>(
              <Card>
                <Row k="Driver" v={item.driver}/>
                <Row k="Truck" v={item.truck}/>
                <Row k="Customer" v={item.customer}/>
                <Row k="Material" v={item.material}/>
                <Row k="From" v={item.pickup}/>
                <Row k="To" v={item.delivery}/>
                <Row k="Odometer" v={item.odom}/>
                <Row k="Start" v={fmt(item.startedAt)}/>
                <Row k="End" v={fmt(item.endedAt)}/>
              </Card>
            )}
          />
          <View style={{padding:theme.pad(2)}}>
            <Pressable onPress={buildCSV} style={[styles.btn, styles.btnSolid]}>
              <Text style={[styles.btnText, { color: theme.white }]}>View CSV</Text>
            </Pressable>
          </View>
        </View>
      )}
      {view==="csv" && (
        <View style={{flex:1,padding:theme.pad(2)}}>
          <Title text="CSV Preview"/>
          <Text style={{marginBottom:theme.pad(1),color:"#333"}}>Select all & copy. (Real app will email at 10 PM once Firebase is added.)</Text>
          <TextInput multiline value={csv||toCSV(trips)} onChangeText={setCsv} style={styles.csv}/>
        </View>
      )}
    </SafeAreaView>
  );
}

// UI helpers
const Header=()=>(
  <View style={styles.header}>
    <Image
      source={{ uri: "https://i.postimg.cc/nrGKqtcN/Conley-crest-no-background.png" }}
      style={{ width: 60, height: 60, resizeMode: "contain" }}
    />
  </View>
);
const Nav=({view,setView})=>(
  <View style={{flexDirection:"row",paddingHorizontal:theme.pad(2),paddingTop:theme.pad(1),gap:theme.pad(1)}}>
    <Tab text="New Trip" active={view==="form"} onPress={()=>setView("form")}/>
    <Tab text="Today's Trips" active={view==="list"} onPress={()=>setView("list")}/>
    <Tab text="CSV" active={view==="csv"} onPress={()=>setView("csv")}/>
  </View>
);
const Tab=({text,active,onPress})=>(
  <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && {color:"#FFF"}]}>{text}</Text>
  </Pressable>
);
const Title=({text})=>(<Text style={styles.title}>{text}</Text>);
const Label=({text})=>(<Text style={styles.label}>{text}</Text>);
const Card=({children})=>(<View style={styles.card}>{children}</View>);
const Row=({k,v})=>(<View style={{flexDirection:"row",marginBottom:4}}><Text style={{fontWeight:"700"}}>{k}: </Text><Text>{v}</Text></View>);
function PickerLike({label,value,options,onChange}){
  const i = Math.max(0, options.indexOf(value));
  const next = () => onChange(options[(i+1)%options.length]);
  return (
    <View style={{marginTop:theme.pad(1)}}>
      <Label text={label}/>
      <Pressable onPress={next} style={styles.select}>
        <Text>{value}</Text>
      </Pressable>
      <Text style={{color:"#666",fontSize:12,marginTop:4}}>Tip: tap to cycle choices</Text>
    </View>
  );
}

const styles=StyleSheet.create({
  header:{ alignItems:"center", justifyContent:"center", paddingVertical:theme.pad(2), backgroundColor:"#FFF", borderBottomWidth:1, borderColor:theme.border },
  tab:{ flex:1, alignItems:"center", paddingVertical:theme.pad(1), borderWidth:2, borderColor:theme.orange, borderRadius:12 },
  tabActive:{ backgroundColor:theme.orange },
  tabText:{ fontWeight:"800", color:theme.orange },
  title:{ fontSize:22, fontWeight:"900", color:"#111", margin:theme.pad(2), marginBottom:theme.pad(1) },
  label:{ fontSize:14, fontWeight:"700", color:"#111", marginBottom:4, marginTop:theme.pad(1) },
  input:{ backgroundColor:"#FFF", borderWidth:1, borderColor:theme.border, borderRadius:12, padding:theme.pad(1.25) },
  select:{ backgroundColor:"#FFF", borderWidth:1, borderColor:theme.border, borderRadius:12, padding:theme.pad(1.25) },
  card:{ backgroundColor:"#F2F2F2", borderWidth:1, borderColor:theme.border, borderRadius:16, padding:theme.pad(2), marginBottom:theme.pad(1) },
  csv:{ borderWidth:1, borderColor:theme.border, borderRadius:12, minHeight:200, padding:theme.pad(1), textAlignVertical:"top", backgroundColor:"#FFF" },
  btn:{ flex:1, alignItems:"center", paddingVertical:theme.pad(1.5), borderRadius:12 },
  btnSolid:{ backgroundColor:theme.orange },
  btnHollow:{ borderWidth:2, borderColor:theme.orange, backgroundColor:"#FFF" },
  btnText:{ fontWeight:"900", fontSize:16 }
});
