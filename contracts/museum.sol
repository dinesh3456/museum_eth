// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Museum {
    // Entrance fee in Wei (0.01 ETH)
    uint256 public constant ENTRANCE_FEE = 0.0001 ether;

    // Mapping to track whether a user has paid the entrance fee
    //mapping(address => bool) private hasPaidEntrance;

    // Event emitted when a user pays the entrance fee
    event EntrancePaid(address indexed user);

    // Predefined image URLs
    string[] public imageUrls = [
        "https://gateway.pinata.cloud/ipfs/QmSSrNfQSyGqX9P3v8UiTdNAs6vSGztuqYWvR3EExR4DXA",
        "https://gateway.pinata.cloud/ipfs/QmcTXJHNScozaRjpbWBSa5in1oSveNZ2ys2fqaguWBWnMX",
        "https://gateway.pinata.cloud/ipfs/QmahFv93WYBm455o6ixjbVfJFe9xgePnUVQG6Fnu3yp4M4"
    ];

    // Function to pay the entrance fee and gain access to view images
    function payEntrance() external payable {
        require(msg.value == ENTRANCE_FEE, "Incorrect entrance fee amount");
        //require(!hasPaidEntrance[msg.sender], "Entrance fee already paid");

        // Mark the user as having paid the entrance fee
        //hasPaidEntrance[msg.sender] = true;

        // Emit the EntrancePaid event
        emit EntrancePaid(msg.sender);
    }

    // Function to check if a user has paid the entrance fee
    // function hasPaidEntranceFee(address user) external view returns (bool) {
    //     return hasPaidEntrance[user];
    // }

    // Function to retrieve the list of predefined image URLs
    function viewImages() external view returns (string[] memory) {
        //require(hasPaidEntrance[msg.sender], "Entrance fee not paid");
        return imageUrls;
    }
}
