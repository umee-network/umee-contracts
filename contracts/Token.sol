import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20//ERC20.sol";


// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "./IERC20.sol";
// import "./extensions/IERC20Metadata.sol";
// import "../../utils/Context.sol";


import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/utils/Context.sol";
/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin guidelines: functions revert instead
 * of returning `false` on failure. This behavior is nonetheless conventional
 * and does not conflict with the expectations of ERC20 applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
// contract ERC20 is Context, IERC20, IERC20Metadata {
contract MeToken is ERC20("MeToken", "UME") {
    // mapping (address => uint256) private _balances; // make sure this is never used by making sure it doesnt exist

    mapping (address => mapping (address => uint256)) private _allowances;

    // uint256 private _totalSupply; // make sure this is never used by making sure it doesnt exist

    // string private _name;
    // string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The defaut value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
     //all underscores are public for TESTING ONLY
     //All standard interfaces should interface with ATOMS

     // remove the var _balances and make sure it all still compiles
     // remove the var _totalAtoms and make sure it all still compiles

    // uint public _multiplier;
    uint public _totalAtoms; // make private? change name to _totalAtoms 
    uint public _totalPoints; // make private?
    mapping(address =>uint256) public _points; // make everyting private probably
    //things to test: putting points/atoms ratio way out of whack in each direction
    //
    
    // mapping(address ->uint) private _ratioOfTotalSupply_x__multiplier;
    constructor(){
        // _totalPoints = 1 * MULTIPLIER; // possibly use something like a thousand or million for this. Not 10e18 though
        _totalPoints = 10e18;
        _totalAtoms = 10e18; //deploy with 1 atom (10e18) to make all the ratio stuff work amazingly
        // _totalPoints = 1;
        // _totalAtoms = 1; //use 1 for testing so we can spot potential issues with ratio mechanism
        // _updateTotalAtomSupply(100 * 10e18);
        // _mint(_msgSender(), 1000);
        // _name = "MeToken";
        // _symbol = "UME";
    }
    function atomsToPoints(uint atoms) public view returns (uint256) { // careful about overflow
        // return atoms * MULTIPLIER/ _totalAtoms * _totalPoints;
        return atoms * _totalPoints / _totalAtoms;
    }
    function pointsToAtoms(uint points) public view returns (uint256) {// careful of possible overflow
        // return points * _totalAtoms / _totalPoints / MULTIPLIER;
        return points * _totalAtoms / _totalPoints;
    }
    function _updateTotalAtomSupply(uint newTotal) public { // add guard modifier
        _totalAtoms = newTotal;
        // log this event in some way
    }
   function _move(
        address from,
        address to,
        uint256 amount
    )
        private
    {
        // _beforeTokenTransfer(operator, from, to, amount);
        uint pointAmount = atomsToPoints(amount);
        
        uint256 fromBalance = _points[from];
        require(fromBalance >= pointAmount, "ERC777: transfer amount exceeds balance");
        
        _points[from] -= pointAmount;
        _points[to] += pointAmount;

        // emit Sent(operator, from, to, amount, userData, operatorData);
        emit Transfer(from, to, amount);
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalAtoms;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    // function balanceOf(address account) public view virtual override returns (uint256) {
    //     return _balances[account];
    // }
    function balanceOf(address tokenHolder) public view virtual override returns (uint256) {
        return pointsToAtoms(_points[tokenHolder]);
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        // _beforeTokenTransfer(sender, recipient, amount);

        _move(sender,recipient, amount);
        // uint256 senderBalance = _balances[sender];
        // require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        // _balances[sender] = senderBalance - amount;
        // _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     */
    function mint(address account, uint256 amount) public {_mint(account, amount);}
    function _mint(address account, uint256 amount) internal virtual override {// unlock (move) to ethereum //(switch back to internal (or private?))
        require(account != address(0), "ERC20: mint to the zero address");

        // _beforeTokenTransfer(address(0), account, amount);

        uint newTotalAtoms = _totalAtoms + amount;
        uint newTotalPoints =  newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = newTotalPoints - _totalPoints;
        // require(_totalPoints * 1000000 / _totalAtoms == newTotalPoints * 1000000 / newTotalAtoms, "ratio mismatch");
        // replace these require staments with js tests with acceptable error intervals
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        // require(points == atomsToPoints(amount), "issue"); turn this on for testing only.
        _points[account] += points;


        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, does NOT reduce the
     * total supply!
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function burn(address account, uint256 amount) public {_burn(account, amount);}
    function _burn(address account, uint256 amount) internal virtual override {// lock (move to cosmos) // (switch back to internal (or private?))
        // require(account != address(0), "ERC20: burn from the zero address");

        // _beforeTokenTransfer(account, address(0), amount);

        uint256 fromBalance = pointsToAtoms(_points[account]);
        require(fromBalance >= amount, "ERC777: burn amount exceeds balance");
        
        uint newTotalAtoms = _totalAtoms - amount;
        uint newTotalPoints = newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = _totalPoints - newTotalPoints;
        // require(_totalPoints * 1000000 / _totalAtoms == newTotalPoints * 1000000 / newTotalAtoms, "ratio mismatch");
        // replace these require staments with js tests with acceptable error intervals
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        // require(points == atomsToPoints(amount), "issue");// maybe turn this on for testing only.
        _points[account] -= points;

        emit Transfer(account, address(0), amount);
    }

    /**
     * @dev Returns the name of the token.
     */
    // function name() public view virtual override returns (string memory) {
    //     return _name;
    // }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    // function symbol() public view virtual override returns (string memory) {
    //     return _symbol;
    // }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * Requirements:
     *
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     * - the caller must have allowance for ``sender``'s tokens of at least
     * `amount`.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, _msgSender(), currentAllowance - amount);

        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    // function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
    //     _approve(_msgSender(), spender, _allowances[_msgSender()][spender] + addedValue);
    //     return true;
    // }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    // function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
    //     uint256 currentAllowance = _allowances[_msgSender()][spender];
    //     require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
    //     _approve(_msgSender(), spender, currentAllowance - subtractedValue);

    //     return true;
    // }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    // function _approve(address owner, address spender, uint256 amount) internal virtual {
    //     require(owner != address(0), "ERC20: approve from the zero address");
    //     require(spender != address(0), "ERC20: approve to the zero address");

    //     _allowances[owner][spender] = amount;
    //     emit Approval(owner, spender, amount);
    // }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be to transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    // function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }
}