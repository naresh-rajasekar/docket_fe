/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from 'axios';


function Docket() {
    const [name, setName] = useState('')
    const [startTime, setStartTime] = useState()
    const [endTime, setEndTime] = useState()
    const [noOfHours, setNoOfHours] = useState("")
    const [ratePerHour, setRatePerHour] = useState("")
    const [supplier, setSupplier] = useState("")
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [dockets, setDockets] = useState([]);
    const [supplierlist, setSupplierList] = useState([])
    const [orders, setOrders] = useState([])
    const [reload, setreload] = useState(false)
    // const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    let [greetings, setGreetings] = useState("")

    const handleTime = () => {
        const event = new Date();
        const eventTime = event.getHours();
      
        if (eventTime >= 0 && eventTime < 12) {
          setGreetings("Good Morning");
        } else if (eventTime >= 12 && eventTime < 16) {
          setGreetings("Good Afternoon");
        } else if (eventTime >= 16 && eventTime < 24) {
          setGreetings("Good Evening");
        }
      };

    const handleGetAllDockets = async() =>{
        try{
            let res = await axios.get(`http://localhost:3000/getDockets`)
            if(res.status === 200){
                setDockets(res.data.docketList)
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleGetAllSuppliers = async() =>{
        try{
            let res = await axios.get(`http://localhost:3000/getSuppliers`)
            if(res.status === 200){
                setSupplierList(res.data.suppliers)
            }
        }catch(error){
            console.log(error)
        }
    }

    const handleGetPOBySupplierName  = async() =>{
        try{
            let res = await axios.post(`http://localhost:3000/orders`, {supplier: supplier})
            if(res.status === 200){
                setOrders(res.data.POList)
            }
        }catch(error){
            console.log(error)
        }
    }
useEffect(() =>{
    handleTime()

    handleGetAllDockets() 
    handleGetAllSuppliers()
}, [reload])

useEffect(() =>{
    handleGetPOBySupplierName()
}, [supplier, show])

const handleSubmit = async (e) => {
    try{
        e.preventDefault()
        const selectedOrder = orders[selectedOrderIndex];
        const data = {
            docketName : name,
            startTime : startTime,
            endTime : endTime,
            noOfHours : noOfHours,
            ratePerHour : ratePerHour,
            supplier : supplier,
            poNumber: selectedOrder['PO Number'],
            poDescription: selectedOrder['description']
        }

        let res = await axios.post('http://localhost:3000/addDocket', data)
        if(res.status === 200){
            
            alert(res.data.message)
            handleClose()
            setreload(true)
            setName("")
            setStartTime()
            setEndTime()
            setNoOfHours()
            setRatePerHour()
            setSupplier()
            setOrders()
        }
    }catch(error){
        console.log(error)
    }
}

  return <>
  <div>
 




 <div style={{top : 0, right : 0, margin: "4px"}}>
    <h2>{greetings} !! </h2>
 <Button variant="primary" onClick={handleShow} >
        Create Docket
      </Button>
 </div>



      <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Total No of Hours</th>
          <th>Rate per Hour</th>
          <th>Supplier</th> 
          <th>Purchase Order
              (PO Number - Description)     
          </th>
        </tr>
      </thead>
      <tbody>
        {
            dockets?.length > 0 ? 
            dockets?.map((docket, i) =>{
                return <tr key={docket?.id}>
                    <td>{i+1}</td>
                <td>{docket?.docketName}</td>
                <td>{docket?.startTime}</td>
                <td>{docket?.endTime}</td>
                <td>{docket?.noOfHours}</td>
                <td>{docket?.ratePerHour}</td>
                <td>{docket?.supplier}</td>
                <td>{docket?.poNumber} {docket?.poDescription}</td>
                </tr>
            }) : <tr>No Data Available</tr>
        }


      </tbody>
    </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="" value={name} onChange={(e) =>{
            setName(e.target.value)
        }} required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Start Time</Form.Label>
        <Form.Control type="time" placeholder="" value={startTime} onChange={(e) =>{
            setStartTime(e.target.value)
        }}  required/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>End Time</Form.Label>
        <Form.Control type="time" placeholder=""  value={endTime} onChange={(e) =>{
            setEndTime(e.target.value)
        }} required/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Total No of Hours</Form.Label>
        <Form.Control type="text" placeholder="" value={noOfHours} onChange={(e) =>{
            setNoOfHours(e.target.value)
        }} required/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Rate per Hour</Form.Label>
        <Form.Control type="text" placeholder="" value={ratePerHour} onChange={(e) =>  {
            setRatePerHour(e.target.value)
        }} required/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"> <Form.Label>Supplier</Form.Label>
      <Form.Select aria-label="Default select example" onChange={(e) =>{
        setSupplier(e.target.value)
      }} required>
        <option disabled selected>Select a supplier</option>
        {
            supplierlist?.length > 0 ? 
            supplierlist?.map((sup, i) =>{
                return <option key={i} value={sup}> {sup}</option>
            }) : <></>
        }
    </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1"> <Form.Label>Purchase Order</Form.Label>
    <Form.Select aria-label="Default select example"
   onChange={(e) => {
    
    const selectedIndex = e.target.value;
    setSelectedOrderIndex(selectedIndex);
  }
 } required>
      <option selected disabled>Select a Purchase Order</option>
        {
            orders?.length > 0 ? orders?.map((order, i) =>{
                return <option key={i} value={i}>{order['PO Number'] + " - " + order['description']}</option>
            }) : <></>
        }
    </Form.Select>
    </Form.Group>
    <Button variant="outline-secondary" type='submit' onClick={handleSubmit}>Button</Button>
    </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    
 



  </div>
  </>
}

export default Docket