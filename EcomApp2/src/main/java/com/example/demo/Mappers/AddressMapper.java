package com.example.demo.Mappers;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.example.demo.Dto.AddressDTO;
import com.example.demo.Entity.Address;

@Component
public class AddressMapper {
    public AddressDTO toAddressDTO(Address address) {
        if (address == null) return null;
        AddressDTO addressDTO = new AddressDTO();
        BeanUtils.copyProperties(address, addressDTO);
        return addressDTO;
    }

    public Address toAddress(AddressDTO addressDTO) {
        if (addressDTO == null) return null;
        Address address = new Address();
        BeanUtils.copyProperties(addressDTO, address);
        return address;
    }
}
