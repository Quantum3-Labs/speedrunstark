/**
 * This file is autogenerated by Scaffold-Stark.
 * You should not edit it manually or your changes might be overwritten.
 */

const deployedContracts = {
  devnet: {
    YourToken: {
      address:
        "0xbf2e7617923f4c791a3bf45dc1c2873d2fdefae0bcdc0ff86402268e79b170",
      abi: [
        {
          type: "impl",
          name: "IYourTokenImpl",
          interface_name: "openzeppelin::token::erc20::interface::IERC20",
        },
        {
          type: "struct",
          name: "core::integer::u256",
          members: [
            {
              name: "low",
              type: "core::integer::u128",
            },
            {
              name: "high",
              type: "core::integer::u128",
            },
          ],
        },
        {
          type: "enum",
          name: "core::bool",
          variants: [
            {
              name: "False",
              type: "()",
            },
            {
              name: "True",
              type: "()",
            },
          ],
        },
        {
          type: "interface",
          name: "openzeppelin::token::erc20::interface::IERC20",
          items: [
            {
              type: "function",
              name: "total_supply",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u256",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "balance_of",
              inputs: [
                {
                  name: "account",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [
                {
                  type: "core::integer::u256",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "allowance",
              inputs: [
                {
                  name: "owner",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "spender",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [
                {
                  type: "core::integer::u256",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "transfer",
              inputs: [
                {
                  name: "recipient",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "amount",
                  type: "core::integer::u256",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "transfer_from",
              inputs: [
                {
                  name: "sender",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "recipient",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "amount",
                  type: "core::integer::u256",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "approve",
              inputs: [
                {
                  name: "spender",
                  type: "core::starknet::contract_address::ContractAddress",
                },
                {
                  name: "amount",
                  type: "core::integer::u256",
                },
              ],
              outputs: [
                {
                  type: "core::bool",
                },
              ],
              state_mutability: "external",
            },
          ],
        },
        {
          type: "impl",
          name: "ERC20MetadataImpl",
          interface_name:
            "openzeppelin::token::erc20::interface::IERC20Metadata",
        },
        {
          type: "struct",
          name: "core::byte_array::ByteArray",
          members: [
            {
              name: "data",
              type: "core::array::Array::<core::bytes_31::bytes31>",
            },
            {
              name: "pending_word",
              type: "core::felt252",
            },
            {
              name: "pending_word_len",
              type: "core::integer::u32",
            },
          ],
        },
        {
          type: "interface",
          name: "openzeppelin::token::erc20::interface::IERC20Metadata",
          items: [
            {
              type: "function",
              name: "name",
              inputs: [],
              outputs: [
                {
                  type: "core::byte_array::ByteArray",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "symbol",
              inputs: [],
              outputs: [
                {
                  type: "core::byte_array::ByteArray",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "decimals",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u8",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "constructor",
          name: "constructor",
          inputs: [
            {
              name: "recipient",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::token::erc20::erc20::ERC20Component::Transfer",
          kind: "struct",
          members: [
            {
              name: "from",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "to",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u256",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::token::erc20::erc20::ERC20Component::Approval",
          kind: "struct",
          members: [
            {
              name: "owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "spender",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "value",
              type: "core::integer::u256",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::token::erc20::erc20::ERC20Component::Event",
          kind: "enum",
          variants: [
            {
              name: "Transfer",
              type: "openzeppelin::token::erc20::erc20::ERC20Component::Transfer",
              kind: "nested",
            },
            {
              name: "Approval",
              type: "openzeppelin::token::erc20::erc20::ERC20Component::Approval",
              kind: "nested",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::YourToken::YourToken::Event",
          kind: "enum",
          variants: [
            {
              name: "ERC20Event",
              type: "openzeppelin::token::erc20::erc20::ERC20Component::Event",
              kind: "flat",
            },
          ],
        },
      ],
      classHash:
        "0x940ba155d095e24cc410bf634d1702adddd3ec84ebc4b059b413145e5132cd",
    },
    Vendor: {
      address:
        "0x462ef55b1b8b860916060a6f8b3664a9a413459ae87b3ef2e48ab55d5a0d134",
      abi: [
        {
          type: "impl",
          name: "VendorImpl",
          interface_name: "contracts::Vendor::IVendor",
        },
        {
          type: "struct",
          name: "core::integer::u256",
          members: [
            {
              name: "low",
              type: "core::integer::u128",
            },
            {
              name: "high",
              type: "core::integer::u128",
            },
          ],
        },
        {
          type: "interface",
          name: "contracts::Vendor::IVendor",
          items: [
            {
              type: "function",
              name: "buy_tokens",
              inputs: [
                {
                  name: "eth_amount_wei",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "withdraw",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "sell_tokens",
              inputs: [
                {
                  name: "amount_tokens",
                  type: "core::integer::u256",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "tokens_per_eth",
              inputs: [],
              outputs: [
                {
                  type: "core::integer::u256",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "your_token",
              inputs: [],
              outputs: [
                {
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "eth_token",
              inputs: [],
              outputs: [
                {
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              state_mutability: "view",
            },
          ],
        },
        {
          type: "impl",
          name: "OwnableImpl",
          interface_name: "openzeppelin::access::ownable::interface::IOwnable",
        },
        {
          type: "interface",
          name: "openzeppelin::access::ownable::interface::IOwnable",
          items: [
            {
              type: "function",
              name: "owner",
              inputs: [],
              outputs: [
                {
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              state_mutability: "view",
            },
            {
              type: "function",
              name: "transfer_ownership",
              inputs: [
                {
                  name: "new_owner",
                  type: "core::starknet::contract_address::ContractAddress",
                },
              ],
              outputs: [],
              state_mutability: "external",
            },
            {
              type: "function",
              name: "renounce_ownership",
              inputs: [],
              outputs: [],
              state_mutability: "external",
            },
          ],
        },
        {
          type: "constructor",
          name: "constructor",
          inputs: [
            {
              name: "eth_token_address",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "your_token_address",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "owner",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
          kind: "struct",
          members: [
            {
              name: "previous_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "new_owner",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
          ],
        },
        {
          type: "event",
          name: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnershipTransferred",
              type: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferred",
              kind: "nested",
            },
            {
              name: "OwnershipTransferStarted",
              type: "openzeppelin::access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
              kind: "nested",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Vendor::Vendor::BuyTokens",
          kind: "struct",
          members: [
            {
              name: "buyer",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "data",
            },
            {
              name: "eth_amount",
              type: "core::integer::u256",
              kind: "data",
            },
            {
              name: "tokens_amount",
              type: "core::integer::u256",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Vendor::Vendor::SellTokens",
          kind: "struct",
          members: [
            {
              name: "seller",
              type: "core::starknet::contract_address::ContractAddress",
              kind: "key",
            },
            {
              name: "tokens_amount",
              type: "core::integer::u256",
              kind: "data",
            },
            {
              name: "eth_amount",
              type: "core::integer::u256",
              kind: "data",
            },
          ],
        },
        {
          type: "event",
          name: "contracts::Vendor::Vendor::Event",
          kind: "enum",
          variants: [
            {
              name: "OwnableEvent",
              type: "openzeppelin::access::ownable::ownable::OwnableComponent::Event",
              kind: "flat",
            },
            {
              name: "BuyTokens",
              type: "contracts::Vendor::Vendor::BuyTokens",
              kind: "nested",
            },
            {
              name: "SellTokens",
              type: "contracts::Vendor::Vendor::SellTokens",
              kind: "nested",
            },
          ],
        },
      ],
      classHash:
        "0x3b85ef9ebc063c265893a17e02769e894787342cc83d530de0f6becb8cff2c",
    },
  },
} as const;

export default deployedContracts;
