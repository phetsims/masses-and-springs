// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var SpringNode = require( 'MASSES_AND_SPRINGS/masses-and-springs/view/SpringNode' );

  function SystemNode( system, options ){

    options = _.extend( {
    }, options );


    var spring = system.spring;

    var xOrigin = 0;
    var yOrigin = 0;

    var springNode = new SpringNode( spring, _.extend( {
      frontColor: 'yellow',
      middleColor: 'red',
      backColor: 'green',
      //boundsMethod: 'none',

      // use x,y exclusively for layout, other translation options are inaccurate because we're using boundsMethod:'none'  ????
      x: xOrigin,
      y: yOrigin
    } , options ) );

    options.children = [ springNode ];

    Node.call( this, options );


  }

  return inherit( Node, SystemNode );

} );