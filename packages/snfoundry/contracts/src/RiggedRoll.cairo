use starknet::ContractAddress;

#[starknet::interface]
pub trait IRiggedRoll<T> {
    fn rigged_roll(ref self: T, amount: u256);
    fn withdraw(ref self: T, to: ContractAddress, amount: u256);
    fn last_dice_value(self: @T) -> u256;
    fn predicted_roll(self: @T) -> u256;
    fn dice_game(self: @T) -> ContractAddress;
}

#[starknet::contract]
mod RiggedRoll {
    use openzeppelin::token::erc20::interface::IERC20CamelDispatcherTrait;
    use contracts::DiceGame::IDiceGameDispatcherTrait;
    use contracts::DiceGame::IDiceGameDispatcher;
    use starknet::{ContractAddress, get_contract_address, get_block_number, get_caller_address};
    use keccak::keccak_u256s_le_inputs;
    use super::IRiggedRoll;
    use openzeppelin::access::ownable::OwnableComponent;

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        dice_game: IDiceGameDispatcher,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        predicted_roll: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, dice_game_address: ContractAddress, owner: ContractAddress
    ) {
        self.dice_game.write(IDiceGameDispatcher { contract_address: dice_game_address });
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl RiggedRollImpl of super::IRiggedRoll<ContractState> {
        fn rigged_roll(
            ref self: ContractState, amount: u256
        ) { // Create the `rigged_roll()` function to predict the randomness in the DiceGame contract and only initiate a roll when it guarantees a win.
        }
        fn withdraw(
            ref self: ContractState, to: ContractAddress, amount: u256
        ) { // Implement the `withdraw` function to transfer Ether from the rigged contract to a specified address.
        }

        fn last_dice_value(self: @ContractState) -> u256 {
            self.dice_game.read().last_dice_value()
        }
        fn predicted_roll(self: @ContractState) -> u256 {
            self.predicted_roll.read()
        }
        fn dice_game(self: @ContractState) -> ContractAddress {
            self.dice_game.read().contract_address
        }
    }
}