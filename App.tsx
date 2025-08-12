import React, { useState } from "react";
import {
  SafeAreaView, View, Text, Pressable, TextInput, FlatList,
  StyleSheet, Alert, ScrollView
} from "react-native";

const DRIVERS = ["Josh", "Jack", "Jeremy", "Dewey"];
const TRUCKS = ["2010 International","2000 Kenworth","1994 Kenworth","2003 Sterling Tandem"];
const CUSTOMERS = ["CCC","Windish","Trotter"];
const MATERIALS = ["rock","sand","dirt"];
const PICKUPS = ["Quarry A","Quarry B","Yard C"];

const theme = { orange:"#F5821E", green:"#28a745", red:"#dc3545", white:"#FFF", border:"#E3E3E3", pad:n=>n*8 };
const pad2 = n => String(n).padStart(2,"0");
const fmt = ts => { if(!ts) return ""; const d=new Date(ts); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const toCSV = trips => ["Driver,Truck,Customer,Material,Pickup,Delivery,Start Odo,Start,End", ...trips.map(t=>[
  t.driver,t.truck,t.customer,t.material,t.pickup,(t.delivery||"").replace(/,/g,";"),t.odom||"",fmt(t.startedAt),fmt(t.endedAt)
].join(","))].join("\n");

/** Inline dropdown with placeholders + black/white menu + orange selected. */
function InlineDropdown({ label, value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const showPlaceholder = !value;
  return (
    <View style={{ marginTop: theme.pad(1.5) }}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[
          styles.select,
          open && { backgroundColor: "#000", borderColor: theme.orange }
        ]}
        onPress={() => setOpen(o => !o)}
      >
        <Text
          style={[
            styles.selectText,
            showPlaceholder ? styles.placeholderText : null,
            open && !showPlaceholder ? { color:"#FFF" } : null
          ]}
        >
          {showPlaceholder ? placeholder : value}
        </Text>
      </Pressable>

      {open && (
        <View style={[styles.inlinePanel, { backgroundColor: "#000" }]}>
          {options.map(opt => {
            const isSelected = opt === value;
            return (
              <Pressable
                key={opt}
                onPress={() => { onChange(opt); setOpen(false); }}
                style={({ pressed }) => [
                  styles.inlineRow,
                  isSelected
                    ? { backgroundColor: theme.orange }
                    : { backgroundColor: pressed ? "#333" : "#000" }
                ]}
              >
                <Text style={{ color: isSelected ? "#000" : "#FFF", fontSize: 16 }}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function App() {
  // Start blank so placeholders show; Driver & Truck persist after trips
  const [driver, setDriver] = useState("");
  const [truck, setTruck] = useState("");
  const [odom, setOdom] = useState("");
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [material, setMaterial] = useState("");
  const [customer, setCustomer] = useState("");

  const [startedAt, setStartedAt] = useState(null);
  const [trips, setTrips] = useState([]);
  const [view, setView] = useState("form"); // "form" | "list" | "csv"
  const [csv, setCsv] = useState("");

  const validateAll = () => {
    if (!driver)   return "Driver required";
    if (!truck)    return "Truck required";
    if (!odom.trim()) return "Starting odometer required";
    if (!pickup)   return "Pickup required";
    if (!delivery.trim()) return "Delivery required";
    if (!material) return "Material required";
    if (!customer) return "Customer required";
    return null;
  };

  const startTrip = () => {
    const err = validateAll();
    if (err) return Alert.alert(err, "Please complete all required fields.");
    setStartedAt(Date.now());
  };

  const endTrip = () => {
    const err = validateAll();
    if (err) return Alert.alert(err, "Please complete all required fields.");
    if (!startedAt) return Alert.alert("Start the trip first", "Tap Start Trip to record the start time.");

    const t = {
      id: String(Math.random()).slice(2),
      driver, truck, customer, material, pickup,
      delivery: delivery.trim(),
      odom: odom.trim(),
      startedAt,
      endedAt: Date.now(),
    };
    setTrips(prev => [t, ...prev]);

    // Reset all except Driver & Truck
    setOdom("");
    setPickup("");
    setDelivery("");
    setMaterial("");
    setCustomer("");
    setStartedAt(null);

    Alert.alert("Trip saved", "You can start the next trip.");
  };

  const buildCSV = () => { setCsv(toCSV(trips)); setView("csv"); };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: theme.white }}>
      {/* Simple header (image can be re-added later as a local asset) */}
      <View style={styles.header}>
        <Text style={{ fontWeight:"900", fontSize:22 }}>CCC Trips</Text>
      </View>

      {/* Tabs */}
      <View style={styles.navRow}>
        <Tab text="New Trip" active={view==="form"} onPress={()=>setView("form")} />
        <Tab text="Today's Trips" active={view==="list"} onPress={()=>setView("list")} />
        <Tab text="CSV" active={view==="csv"} onPress={()=>setView("csv")} />
      </View>

      {view === "form" && (
        <ScrollView contentContainerStyle={{ padding: theme.pad(2), paddingBottom: theme.pad(4) }}>
          <Text style={styles.title}>New Trip</Text>

          {/* Order: Driver, Truck, Starting Odometer, Pickup, Delivery, Material, Customer */}
          <InlineDropdown
            label="Driver"
            value={driver}
            options={DRIVERS}
            onChange={setDriver}
            placeholder="Choose driver"
          />

          <InlineDropdown
            label="Truck"
            value={truck}
            options={TRUCKS}
            onChange={setTruck}
            placeholder="Choose truck"
          />

          <Text style={styles.label}>Starting Odometer</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter starting odometer"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={odom}
            onChangeText={setOdom}
          />

          <InlineDropdown
            label="Pickup Location"
            value={pickup}
            options={PICKUPS}
            onChange={setPickup}
            placeholder="Choose pickup location"
          />

          <Text style={styles.label}>Delivery Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter delivery location / job site"
            placeholderTextColor="#888"
            value={delivery}
            onChangeText={setDelivery}
          />

          <InlineDropdown
            label="Material"
            value={material}
            options={MATERIALS}
            onChange={setMaterial}
            placeholder="Choose material"
          />

          <InlineDropdown
            label="Customer"
            value={customer}
            options={CUSTOMERS}
            onChange={setCustomer}
            placeholder="Choose customer"
          />

          <View style={styles.buttonsRow}>
            <Pressable onPress={startTrip} style={[styles.btn, { backgroundColor: theme.green }]}>
              <Text style={[styles.btnText, { color: theme.white }]}>
                {startedAt ? `Started ✓ (${new Date(startedAt).toLocaleTimeString()})` : "Start Trip"}
              </Text>
            </Pressable>
            <Pressable onPress={endTrip} style={[styles.btn, { backgroundColor: theme.red }]}>
              <Text style={[styles.btnText, { color: theme.white }]}>End Trip</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {view === "list" && (
        <View style={{ flex:1 }}>
          <Text style={styles.title}>Today's Trips</Text>
          <FlatList
            contentContainerStyle={{ padding: theme.pad(2) }}
            data={trips}
            keyExtractor={(t)=>t.id}
            ListEmptyComponent={<Text style={{ textAlign:"center", marginTop: theme.pad(4), fontSize:16 }}>No trips yet.</Text>}
            renderItem={({item})=>(
              <View style={styles.card}>
                <Row k="Driver" v={item.driver} />
                <Row k="Truck" v={item.truck} />
                <Row k="Customer" v={item.customer} />
                <Row k="Material" v={item.material} />
                <Row k="From" v={item.pickup} />
                <Row k="To" v={item.delivery} />
                <Row k="Odometer" v={item.odom} />
                <Row k="Start" v={fmt(item.startedAt)} />
                <Row k="End" v={fmt(item.endedAt)} />
              </View>
            )}
          />
          <View style={{ padding: theme.pad(2) }}>
            <Pressable onPress={buildCSV} style={[styles.btn, { backgroundColor: theme.orange }]}>
              <Text style={[styles.btnText, { color: theme.white }]}>View CSV</Text>
            </Pressable>
          </View>
        </View>
      )}

      {view === "csv" && (
        <View style={{ flex:1, padding: theme.pad(2) }}>
          <Text style={styles.title}>CSV Preview</Text>
          <Text style={{ marginBottom: theme.pad(1), color:"#333", fontSize:16 }}>
            Select all & copy. (The real app will email this at 10 PM once Firebase is added.)
          </Text>
          <TextInput multiline value={csv || toCSV(trips)} onChangeText={setCsv} style={styles.csv} />
        </View>
      )}
    </SafeAreaView>
  );
}

const Tab = ({ text, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
    <Text style={[styles.tabText, active && { color: "#FFF" }]}>{text}</Text>
  </Pressable>
);

const Row = ({ k, v }) => (
  <View style={{ flexDirection:"row", marginBottom:6 }}>
    <Text style={{ fontWeight:"700", fontSize:16 }}>{k}: </Text>
    <Text style={{ fontSize:16 }}>{String(v || "")}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems:"center", justifyContent:"center",
    paddingVertical: theme.pad(2), backgroundColor: theme.white,
    borderBottomWidth: 1, borderColor: theme.border
  },
  navRow: { flexDirection:"row", paddingHorizontal: theme.pad(2), paddingTop: theme.pad(1), gap: theme.pad(1) },
  tab: {
    flex:1, alignItems:"center", paddingVertical: theme.pad(1),
    borderWidth:2, borderColor: theme.orange, borderRadius: 12
  },
  tabActive: { backgroundColor: theme.orange },
  tabText: { fontWeight:"800", fontSize:16, color: theme.orange },

  title: { fontSize:24, fontWeight:"900", color:"#111", margin: theme.pad(2), marginBottom: theme.pad(1) },
  label: { fontSize:16, fontWeight:"700", color:"#111", marginBottom:6, marginTop: theme.pad(1) },

  input: {
    backgroundColor:"#FFF", borderWidth:1, borderColor: theme.border, borderRadius:12,
    padding: theme.pad(1.5), fontSize:16
  },
  select:{
    backgroundColor:"#FFF", borderWidth:1, borderColor: theme.border, borderRadius:12,
    padding: theme.pad(1.5)
  },
  selectText:{ fontSize:16 },
  placeholderText:{ color:"#888" },

  inlinePanel: { borderWidth:1, borderColor: theme.orange, borderRadius:12, marginTop:6, overflow:"hidden" },
  inlineRow: { paddingVertical:14, paddingHorizontal:12, borderBottomWidth:1, borderColor:"#222" },

  card:{ backgroundColor:"#F2F2F2", borderWidth:1, borderColor: theme.border, borderRadius:16, padding: theme.pad(2), marginBottom: theme.pad(1.5) },
  csv:{ borderWidth:1, borderColor: theme.border, borderRadius:12, minHeight:220, padding: theme.pad(1.5), textAlignVertical:"top", backgroundColor:"#FFF", fontSize:14 },

  buttonsRow:{ flexDirection:"row", gap: theme.pad(1), marginTop: theme.pad(2) },
  btn:{ flex:1, alignItems:"center", paddingVertical: theme.pad(1.75), borderRadius:12 },
  btnText:{ fontWeight:"900", fontSize:18 },
});
