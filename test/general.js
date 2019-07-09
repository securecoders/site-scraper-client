var
  expect = require('chai').expect,
  scraperClient = require('../index'),
  testAppId = process.env.TEST_APP_ID;

describe('Scraper Client Tests', function(){

  describe('Client Setup', function(){

	it('Test Require appId, Use defaults', function(done){
	  try{
		var SC = new scraperClient();

		expect(SC.options).to.exist;
		expect(SC.options.version).to.equal('1.0');
		expect(SC.options.cacheOk).to.equal(true);

		done();
	  }
	  catch (e){
		//expect(e).to.contain('appId');
		expect(e).to.eql('appId must be supplied when making requests to the API.');
		done();
	  };
	});

	it('Initialize with appId, Use defaults', function(done){
	  try{
		var sC = new scraperClient({appId: testAppId});

		expect(sC.options).to.exist;
		expect(sC.options.version).to.equal('1.0');
		expect(sC.options.cacheOk).to.equal(true);

		done();
	  }
	  catch (e){
		expect(e).to.contain('appId');
		done();
	  };
	});

	it('Allow overriding of defaults', function(done){

	  var sC = new scraperClient({cacheOk: false, appId: testAppId});
	  expect(sC.options.cacheOk).to.equal(false);

	  // default unimpacted values should still be there
	  expect(sC.options.version).to.equal('1.0');

	  done();

	});

	it('Initialize with one line and no options', function(done){

	  var sC = require('../index')({cacheOk: false, appId: testAppId});

	  expect(sC.options.cacheOk).to.equal(false);

	  // default unimpacted values should still be there
	  expect(sC.options.version).to.equal('1.0');

	  done();

	});

	it('Initialize with one line', function(done){

	  var sC = require('../index')({appId: testAppId});

	  expect(sC.options.cacheOk).to.equal(true);

	  // default unimpacted values should still be there
	  expect(sC.options.version).to.equal('1.0');

	  done();

	});

  });

  describe('Request Setup', function(){

	it('Create a valid URL with no options', function(done){

	  var target = 'http://cnn.com';

	  var sC = new scraperClient({appId: testAppId});
	  var url = sC._getSiteInfoUrl(target, sC.options);

	  expect(url).to.equal('https://f66c5961.ngrok.io/api/1.0/scrape/?url=' + encodeURIComponent(target));
	  done();

	});

	it('Use https when using an appId', function(done){

	  var target = 'http://cnn.com';

	  var sC = new scraperClient({appId: '111111111'});
	  var url = sC._getSiteInfoUrl(target, sC.options);

	  expect(url).to.equal('https://f66c5961.ngrok.io/api/1.0/scrape/?url=' + encodeURIComponent(target));
	  done();

	});

	it('should create a proper query parameters', function(done){

	  var appId = 'XXXXXXXXXX';

	  var sC = new scraperClient({cacheOk: false, appId: appId});
	  var params = sC._getSiteInfoQueryParams(sC.options);

	  expect(params.cache_ok).to.equal('false');
	  expect(params.app_id).to.equal(appId);

	  done();

	});

  });

  describe('Full Tests', function(){

	var sC;
	var testUrl ='http://github.com';

	before(function(done){
	  sC = new scraperClient({appId: testAppId});
	  done();
	});

	it('Get results from a site with no option and only a callback', function(done){

	  sC.getSiteData(testUrl , {json: true}, function(err, result){
		expect(err).to.not.exist;
		expect(result).to.exist;
		expect(result.url).to.equal(testUrl);
		expect(result.response.statusCode).to.equal(200);

		done();
	  });

	});

	it('Get results from a site with options and a callback', function(done){

	  sC.getSiteData(testUrl, {json: true}, function(err, result){
		expect(err).to.not.exist;
		expect(result).to.exist;
		expect(result.url).to.equal(testUrl);
		expect(result.response.statusCode).to.equal(200);

		done();
	  });
	});

	it('Get results from a site with no options returning a promise', function(done){
	  sC.getSiteData(testUrl, {json: true})
		.then(function(result){
		  expect(result).to.exist;
		  expect(result.url).to.equal(testUrl);
		  expect(result.response.statusCode).to.equal(200);

		  done();
		});
	});

	it('Get results from a site with options returning a promise', function(done){
	  sC.getSiteData(testUrl, {json: true})
		.then(function(result){
		  expect(result).to.exist;
		  expect(result.url).to.equal(testUrl);
		  expect(result.response.statusCode).to.equal(200);

		  done();
		});
	});

	it('Get full page render using a promise.', function(done){
	  sC.getSiteRender(testUrl, {json: true})
		.then(function(result){
		  expect(result).to.exist;
		  expect(result.url).to.equal(testUrl);
		  expect(result.response.statusCode).to.equal(200);

		  done();
		});
	});

  });

})