



function MachineUnit({ machineNum, machineInfo }) {
    return (
        <div>
            <p>machineNum: {machineNum}</p>
            <p>typeID: {machineInfo.ID}</p>
            <p>level: {machineInfo.level}</p>
            <p>produceReceived: {machineInfo.produceReceived}</p>
            <p>startTime: {machineInfo.startTime}</p>
        </div>
    )
}

export default MachineUnit;