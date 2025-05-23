/**
 * SKU Mapper Class
 * Responsible for mapping SKUs to MSKUs
 */
class SkuMapper {
  constructor(mappings = []) {
    this.mappings = mappings;
    this.exactMatches = new Map();
    this.patterns = [];
    
    this.initializeMapper();
  }
  
  /**
   * Initialize the mapper with existing mappings
   */
  initializeMapper() {
    // Build exact match lookup
    this.mappings.forEach(mapping => {
      const key = this.generateMappingKey(mapping.sku, mapping.marketplace);
      this.exactMatches.set(key, mapping.msku);
    });
    
    // Build pattern recognition
    this.buildPatterns();
  }
  
  /**
   * Generate a unique key for a SKU-marketplace combination
   */
  generateMappingKey(sku, marketplace) {
    return `${sku.toLowerCase()}:${marketplace.toLowerCase()}`;
  }
  
  /**
   * Add a new mapping
   */
  addMapping(sku, msku, marketplace) {
    const key = this.generateMappingKey(sku, marketplace);
    
    // Check if mapping already exists
    if (this.exactMatches.has(key)) {
      return {
        success: false,
        message: `Mapping already exists for SKU ${sku} in ${marketplace}`
      };
    }
    
    // Add to exact matches
    this.exactMatches.set(key, msku);
    
    // Add to mappings array
    const newMapping = { sku, msku, marketplace };
    this.mappings.push(newMapping);
    
    // Rebuild patterns
    this.buildPatterns();
    
    return {
      success: true,
      mapping: newMapping
    };
  }
  
  /**
   * Remove a mapping
   */
  removeMapping(sku, marketplace) {
    const key = this.generateMappingKey(sku, marketplace);
    
    // Check if mapping exists
    if (!this.exactMatches.has(key)) {
      return {
        success: false,
        message: `No mapping exists for SKU ${sku} in ${marketplace}`
      };
    }
    
    // Remove from exact matches
    this.exactMatches.delete(key);
    
    // Remove from mappings array
    const index = this.mappings.findIndex(
      m => m.sku.toLowerCase() === sku.toLowerCase() && 
           m.marketplace.toLowerCase() === marketplace.toLowerCase()
    );
    
    if (index !== -1) {
      this.mappings.splice(index, 1);
    }
    
    // Rebuild patterns
    this.buildPatterns();
    
    return {
      success: true,
      message: `Mapping removed for SKU ${sku} in ${marketplace}`
    };
  }
  
  /**
   * Get MSKU for a given SKU and marketplace
   */
  getMsku(sku, marketplace) {
    if (!sku) {
      return {
        success: false,
        message: 'SKU is required'
      };
    }
    
    if (!marketplace) {
      return {
        success: false,
        message: 'Marketplace is required'
      };
    }
    
    // Try exact match
    const key = this.generateMappingKey(sku, marketplace);
    if (this.exactMatches.has(key)) {
      return {
        success: true,
        msku: this.exactMatches.get(key),
        matchType: 'exact'
      };
    }
    
    // Try pattern matching
    const patternMatch = this.findPatternMatch(sku, marketplace);
    if (patternMatch) {
      return {
        success: true,
        msku: patternMatch.msku,
        matchType: 'pattern',
        confidence: patternMatch.confidence
      };
    }
    
    return {
      success: false,
      message: `No mapping found for SKU ${sku} in ${marketplace}`
    };
  }
  
  /**
   * Build pattern recognition rules from existing mappings
   */
  buildPatterns() {
    this.patterns = [];
    
    // Group mappings by MSKU
    const mskuGroups = {};
    this.mappings.forEach(mapping => {
      if (!mskuGroups[mapping.msku]) {
        mskuGroups[mapping.msku] = [];
      }
      mskuGroups[mapping.msku].push(mapping);
    });
    
    // For each MSKU group, identify patterns
    Object.keys(mskuGroups).forEach(msku => {
      const mappings = mskuGroups[msku];
      
      // Find common prefixes and suffixes
      if (mappings.length >= 2) {
        this.findCommonPatterns(mappings, msku);
      }
    });
  }
  
  /**
   * Find common patterns among a group of SKUs that map to the same MSKU
   */
  findCommonPatterns(mappings, msku) {
    // Extract product name from MSKU (assuming format like PRODUCT-NUMBER)
    const productMatch = msku.match(/^([A-Z]+)-\d+$/);
    if (productMatch) {
      const productName = productMatch[1];
      
      // Create a pattern that looks for product name in SKU
      this.patterns.push({
        msku,
        type: 'product-name',
        test: (sku) => sku.toUpperCase().includes(productName),
        confidence: 0.7
      });
    }
    
    // Look for common prefixes
    let skus = mappings.map(m => m.sku.toLowerCase());
    let prefix = this.findLongestCommonPrefix(skus);
    if (prefix && prefix.length >= 3) {
      this.patterns.push({
        msku,
        type: 'prefix',
        test: (sku) => sku.toLowerCase().startsWith(prefix),
        confidence: 0.8
      });
    }
    
    // Look for common suffixes
    let suffix = this.findLongestCommonSuffix(skus);
    if (suffix && suffix.length >= 3) {
      this.patterns.push({
        msku,
        type: 'suffix',
        test: (sku) => sku.toLowerCase().endsWith(suffix),
        confidence: 0.8
      });
    }
    
    // Color/variant patterns (e.g., WIDGET-BLUE, BLUE-W both map to WIDGET-001)
    const colorTerms = ['red', 'blue', 'green', 'black', 'white', 'purple', 'yellow', 'orange'];
    const sizeTerms = ['small', 'medium', 'large', 'xl', 'xxl', 'mini', 'giant'];
    
    // Check if any of the mappings contain color or size terms
    const hasColorOrSize = mappings.some(mapping => {
      const lowerSku = mapping.sku.toLowerCase();
      return colorTerms.some(color => lowerSku.includes(color)) || 
             sizeTerms.some(size => lowerSku.includes(size));
    });
    
    if (hasColorOrSize) {
      // Create patterns for color variations
      colorTerms.forEach(color => {
        this.patterns.push({
          msku,
          type: 'color-variant',
          test: (sku) => sku.toLowerCase().includes(color),
          confidence: 0.6,
          colorTerm: color
        });
      });
      
      // Create patterns for size variations
      sizeTerms.forEach(size => {
        this.patterns.push({
          msku,
          type: 'size-variant',
          test: (sku) => sku.toLowerCase().includes(size),
          confidence: 0.6,
          sizeTerm: size
        });
      });
    }
  }
  
  /**
   * Find the longest common prefix among an array of strings
   */
  findLongestCommonPrefix(strings) {
    if (!strings.length) return '';
    
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (prefix === '') return '';
      }
    }
    
    return prefix;
  }
  
  /**
   * Find the longest common suffix among an array of strings
   */
  findLongestCommonSuffix(strings) {
    if (!strings.length) return '';
    
    // Reverse all strings
    const reversed = strings.map(s => s.split('').reverse().join(''));
    
    // Find common prefix of reversed strings
    const commonPrefix = this.findLongestCommonPrefix(reversed);
    
    // Reverse back to get suffix
    return commonPrefix.split('').reverse().join('');
  }
  
  /**
   * Find a pattern match for a given SKU and marketplace
   */
  findPatternMatch(sku, marketplace) {
    // If we have patterns, try to match
    if (this.patterns.length > 0) {
      // Filter patterns by those that match the SKU
      const matchingPatterns = this.patterns.filter(pattern => pattern.test(sku));
      
      // If we have matches, return the one with highest confidence
      if (matchingPatterns.length > 0) {
        matchingPatterns.sort((a, b) => b.confidence - a.confidence);
        return matchingPatterns[0];
      }
    }
    
    return null;
  }
  
  /**
   * Bulk process multiple SKUs
   */
  bulkProcess(skuData) {
    const results = {
      processed: 0,
      matched: 0,
      notMatched: 0,
      details: []
    };
    
    skuData.forEach(item => {
      results.processed++;
      
      const { sku, marketplace } = item;
      const result = this.getMsku(sku, marketplace);
      
      if (result.success) {
        results.matched++;
        results.details.push({
          sku,
          marketplace,
          msku: result.msku,
          matchType: result.matchType,
          confidence: result.confidence || 1.0
        });
      } else {
        results.notMatched++;
        results.details.push({
          sku,
          marketplace,
          error: result.message
        });
      }
    });
    
    return results;
  }
}

export default SkuMapper;