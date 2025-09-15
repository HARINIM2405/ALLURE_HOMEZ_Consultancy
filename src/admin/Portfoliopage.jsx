import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Container, TextField, Typography, Paper, Grid, IconButton, Divider,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import './Portfoliopage.css';

const BASE_URL = 'http://localhost:5000';

const Portfoliopage = () => {
  const [portfolio, setPortfolio] = useState({
    introTitle: '',
    introText: '',
    materialTitle: '',
    materialDescription: '',
    materials: [],
    dealersTitle: '',
    dealersText: '',
    dealers: [],
    featuredProjects: [],
    productShowcase: {
      Curtains: [],
      Cushions: [],
      Bedding: [],
      Kitchen: []
    }
  });

  const [featuredImages, setFeaturedImages] = useState({});
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('/api/portfolio');
        const data = res.data || {};
        setPortfolio(prev => ({
          ...prev,
          ...data,
          materials: data.materials || [],
          dealers: data.dealers || [],
          featuredProjects: data.featuredProjects || [],
          productShowcase: {
            Curtains: data.productShowcase?.Curtains || [],
            Cushions: data.productShowcase?.Cushions || [],
            Bedding: data.productShowcase?.Bedding || [],
            Kitchen: data.productShowcase?.Kitchen || []
          }
        }));
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      }
    };
    fetchPortfolio();
  }, []);

  const handleChange = (e) => setPortfolio({ ...portfolio, [e.target.name]: e.target.value });

  const handleArrayChange = (type, index, field, value) => {
    const updated = [...portfolio[type]];
    updated[index][field] = value;
    setPortfolio({ ...portfolio, [type]: updated });
  };

  const addItem = (type, template) =>
    setPortfolio({ ...portfolio, [type]: [...portfolio[type], template] });

  const removeItem = (type, index) => {
    const updated = [...portfolio[type]];
    updated.splice(index, 1);
    setPortfolio({ ...portfolio, [type]: updated });
  };

  const handleFeaturedImageChange = (index, file) => {
    setFeaturedImages(prev => ({ ...prev, [index]: file }));
  };

  const handleProductImageChange = (key, file) => {
    setProductImages(prev => ({ ...prev, [key]: file }));
  };

  useEffect(() => {
    const uploadFeaturedImages = async () => {
      for (const [index, file] of Object.entries(featuredImages)) {
        if (!file) continue;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await axios.post('/api/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const updated = [...portfolio.featuredProjects];
          updated[parseInt(index)].imageUrl = res.data.imageUrl;
          setPortfolio(prev => ({ ...prev, featuredProjects: updated }));
        } catch (err) {
          console.error(`Upload failed for featured project ${index}`, err);
        }
      }
      setFeaturedImages({});
    };

    if (Object.keys(featuredImages).length > 0) uploadFeaturedImages();
  }, [featuredImages]);

  useEffect(() => {
    const uploadProductImages = async () => {
      for (const [key, file] of Object.entries(productImages)) {
        if (!file) continue;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await axios.post('/api/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          const [category, index] = key.split('_');
          const updated = [...portfolio.productShowcase[category]];
          updated[parseInt(index)].imageUrl = res.data.imageUrl;
          setPortfolio(prev => ({
            ...prev,
            productShowcase: {
              ...prev.productShowcase,
              [category]: updated
            }
          }));
        } catch (err) {
          console.error(`Upload failed for ${key}`, err);
        }
      }
      setProductImages({});
    };

    if (Object.keys(productImages).length > 0) uploadProductImages();
  }, [productImages]);

  const handleSave = async () => {
    try {
      await axios.put('/api/portfolio', portfolio);
      alert('Portfolio saved!');
    } catch (err) {
      console.error('Save failed', err);
      alert('Error saving portfolio.');
    }
  };

  const fieldHasImage = (type) => type === 'featuredProjects';

  const renderArraySection = (label, type, template, fields) => (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>{label}</Typography>
      {portfolio[type].map((item, i) => (
        <Paper key={i} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            {fields.map(field => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={item[field.name]}
                  onChange={(e) => handleArrayChange(type, i, field.name, e.target.value)}
                />
              </Grid>
            ))}
            {fieldHasImage(type) && (
              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={(e) => {
                    if (type === 'featuredProjects') handleFeaturedImageChange(i, e.target.files[0]);
                  }} />
                </Button>
                {item.imageUrl && (
                  <Box mt={1}>
                    <img src={`${BASE_URL}${item.imageUrl}`} alt="Preview" width="120" />
                  </Box>
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <IconButton color="error" onClick={() => removeItem(type, i)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button variant="outlined" startIcon={<Add />} onClick={() => addItem(type, template)}>
        Add {label}
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Edit Portfolio</Typography>

      <TextField fullWidth label="Intro Title" name="introTitle" value={portfolio.introTitle} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Intro Text" name="introText" value={portfolio.introText} onChange={handleChange} multiline rows={3} sx={{ mb: 4 }} />

      <Divider sx={{ my: 4 }} />

      <TextField fullWidth label="Material Title" name="materialTitle" value={portfolio.materialTitle} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Material Description" name="materialDescription" value={portfolio.materialDescription} onChange={handleChange} multiline rows={3} sx={{ mb: 4 }} />
      {renderArraySection('Material', 'materials', { name: '', description: '' }, [
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description' }
      ])}

      <TextField fullWidth label="Dealers Title" name="dealersTitle" value={portfolio.dealersTitle} onChange={handleChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Dealers Text" name="dealersText" value={portfolio.dealersText} onChange={handleChange} multiline rows={3} sx={{ mb: 4 }} />
      {renderArraySection('Dealer', 'dealers', { name: '', subtitle: '', initial: '' }, [
        { name: 'name', label: 'Name' },
        { name: 'subtitle', label: 'Subtitle' },
        { name: 'initial', label: 'Initial' }
      ])}

      <Divider sx={{ my: 4 }} />

      {renderArraySection('Featured Project', 'featuredProjects', { title: '', description: '', imageUrl: '' }, [
        { name: 'title', label: 'Title' },
        { name: 'description', label: 'Description' }
      ])}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>Product Showcase</Typography>
      {['Curtains', 'Cushions', 'Bedding', 'Kitchen'].map((cat) => (
        <Accordion key={cat}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">{cat}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {portfolio.productShowcase[cat].map((item, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Title" value={item.title} onChange={(e) => {
                      const updated = [...portfolio.productShowcase[cat]];
                      updated[i].title = e.target.value;
                      setPortfolio(prev => ({
                        ...prev,
                        productShowcase: { ...prev.productShowcase, [cat]: updated }
                      }));
                    }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Subtitle" value={item.subtitle} onChange={(e) => {
                      const updated = [...portfolio.productShowcase[cat]];
                      updated[i].subtitle = e.target.value;
                      setPortfolio(prev => ({
                        ...prev,
                        productShowcase: { ...prev.productShowcase, [cat]: updated }
                      }));
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Description" multiline rows={2} value={item.description} onChange={(e) => {
                      const updated = [...portfolio.productShowcase[cat]];
                      updated[i].description = e.target.value;
                      setPortfolio(prev => ({
                        ...prev,
                        productShowcase: { ...prev.productShowcase, [cat]: updated }
                      }));
                    }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button component="label" variant="outlined">
                      Upload Image
                      <input type="file" hidden accept="image/*" onChange={(e) => handleProductImageChange(`${cat}_${i}`, e.target.files[0])} />
                    </Button>
                    {item.imageUrl && (
                      <Box mt={1}>
                        <img src={`${BASE_URL}${item.imageUrl}`} alt="Product" width="120" />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <IconButton color="error" onClick={() => {
                      const updated = [...portfolio.productShowcase[cat]];
                      updated.splice(i, 1);
                      setPortfolio(prev => ({
                        ...prev,
                        productShowcase: { ...prev.productShowcase, [cat]: updated }
                      }));
                    }}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Button variant="outlined" startIcon={<Add />} onClick={() => {
              setPortfolio(prev => ({
                ...prev,
                productShowcase: {
                  ...prev.productShowcase,
                  [cat]: [...prev.productShowcase[cat], { title: '', subtitle: '', description: '', imageUrl: '' }]
                }
              }));
            }}>
              Add {cat} Product
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}


      <Divider sx={{ my: 4 }} />

      <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
        Save Portfolio
      </Button>
    </Container>
  );
};

export default Portfoliopage;
