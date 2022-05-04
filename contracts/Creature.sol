// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

/**
 * @title Creature
 * Creature - a contract for my non-fungible creatures.
 */
contract Creature is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        ERC721Tradable("Creature", "OSC", _proxyRegistryAddress)
    {}

    function baseTokenURI() override public pure returns (string memory) {
        return "https://bafybeiarxu6i2xfati77zkmajq5bz6yrupu4x75p5t6ukjbbmiyr3pxqd4.ipfs.dweb.link/metadata/";
    }

    function contractURI() public pure returns (string memory) {
        return <contractUrlHere>;
    }
}
