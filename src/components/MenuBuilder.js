import React, { useState } from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';
import '../App.css';
import Bin from './Bin';
import Edit from './Edit';

const MenuBuilder = () => {
  const [treeData, setTreeData] = useState([
    {
      title: 'Category 1',
      key: '0-0',
      children: [
        { title: 'Subcategory 1.1', key: '0-0-0' },
        { title: 'Subcategory 1.2', key: '0-0-1' },
      ],
    },
    {
      title: 'Category 2',
      key: '0-1',
      children: [
        { title: 'Subcategory 2.1', key: '0-1-0' },
      ],
    },
  ]);

  const [selectedKey, setSelectedKey] = useState(null);
  const [newNodeTitle, setNewNodeTitle] = useState('');


  const addNewNode = (data, key, newNode = undefined) => {
    console.log(data);
    console.log("Selected Key = " + key);
  
    let newData = data.map((node) => {
      console.log("Current node = " + JSON.stringify(node));
  
      if (node.key === key) {
        console.log("Key Match");
        node.children = node.children || [];
        node.children.push(newNode);
        return node; 
      } 
      else if (node.children && node.children.length > 0) {
        console.log("Key Not Match - Recursing into children");
        node.children = addNewNode(node.children, key, newNode);
        return node;
      } 
      
      console.log("No children or key match");
      return node;
    });
  
    return newData; 
  };
  
  const editTreeNode = (data, key , newTitle = undefined) => {
    data.forEach((node) => {
      if (node.key === key) {
        node.title = newTitle;
      } else if (node.children) {
        editTreeNode(node.children, key, newTitle);
      }
    });
  };

  const deleteTreeNode = (data, key) => {
    return data.filter((node) => {
      if (node.key === key) return false;
      if (node.children) node.children = deleteTreeNode(node.children, key);
      return true;
    });
  };
 
  const addNode = () => {
    if (!newNodeTitle.trim()) return;

    const newKey = `${Date.now()}`; 
    const newNode = { title: newNodeTitle, key: newKey };
    const updatedTree = [...treeData];

    if (selectedKey) 
    {
      addNewNode(updatedTree, selectedKey , newNode);
    } else {
      updatedTree.push(newNode);
    }

    setTreeData(updatedTree);
    setNewNodeTitle('');
  };

  const editNode = (key, newTitle) => {
    const updatedTree = [...treeData];
    editTreeNode(updatedTree, key , newTitle);
    setTreeData(updatedTree);
  };

  const deleteNode = (key) => {
    const updatedTree = deleteTreeNode([...treeData], key);
    setTreeData(updatedTree);
    setSelectedKey(""); 
  };

  const renderTitle = (node) => {
    return (
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-800">{node.title}</span>
        <div className="space-x-2 mx-5 inline-flex items-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-0.5 px-3 rounded focus:outline-none text-sm"
            onClick={() => editNode(node.key, prompt('Edit title:', node.title))}
          >
            <Edit />
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-0.5 px-3 rounded focus:outline-none text-sm"
            onClick={() => deleteNode(node.key)}
          >
            <Bin />
          </button>
        </div>
      </div>
    );
  };

const mapTreeNodes = (nodes) => {
  return nodes.map((node) => ({
    ...node,
    title: renderTitle(node), 
    children: node.children ? mapTreeNodes(node.children) : undefined, 
  }));
};

  return (
    <div className="menu-builder p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Menu Builder</h2>
  
      <div className="bg-white p-4 shadow-md rounded-md">
        <Tree
          treeData={mapTreeNodes(treeData)}
          onSelect={(selectedKeys) => setSelectedKey(selectedKeys[0])}
          className="mb-4 py-5"
        />
      </div>
  
      <div className="controls mt-6 space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder="New node title"
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNode}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none"
          >
            Add Node
          </button>
        </div>
  
        {/* {selectedKey ? (
          <p className="text-gray-600">Selected node key: {selectedKey}</p>
        ) : (
          <p className="text-gray-400">No node selected</p>
        )} */}
      </div>
    </div>
  );
};

export default MenuBuilder;
