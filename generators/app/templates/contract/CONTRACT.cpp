#include "./<%= moduleNameCamelCased %>.hpp"

using namespace eosio;
using namespace std;

void <%= moduleNameCamelCased %>::init(name name)
{
    require_auth(_self);
}

void <%= moduleNameCamelCased %>::transfer(name from, name to, asset quantity, string memo)
{
    if (from == _self)
    {
        // we're sending money, do nothing additional
        return;
    }

    eosio_assert(to == _self, "contract is not involved in this transfer");
    eosio_assert(quantity.symbol.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "only positive quantity allowed");
    eosio_assert(quantity.symbol == EOS_SYMBOL, "only EOS tokens allowed");
}

void <%= moduleNameCamelCased %>::testreset()
{
    require_auth(_self);
    // auto itr = games.begin();
    // while(itr != games.end()) {
    //     itr = games.erase(itr);
    // }
}

extern "C" void apply(uint64_t receiver, uint64_t code, uint64_t action)
{
    if (code == "eosio.token"_n.value && action == "transfer"_n.value)
    {
        eosio::execute_action(eosio::name(receiver), eosio::name(code), &<%= moduleNameCamelCased %>::transfer);
    }
    else if (code == receiver)
    {
        switch (action)
        {
            EOSIO_DISPATCH_HELPER(<%= moduleNameCamelCased %>, (init)(testreset))
        }
    }
}
