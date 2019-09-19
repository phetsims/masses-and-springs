// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel that manages options for visibility of reference lines on vector screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const BracketNode = require( 'SCENERY_PHET/BracketNode' );
  const DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  const displacementString = require( 'string!MASSES_AND_SPRINGS/displacement' );
  const massEquilibriumString = require( 'string!MASSES_AND_SPRINGS/massEquilibrium' );
  const movableLineString = require( 'string!MASSES_AND_SPRINGS/movableLine' );
  const naturalLengthString = require( 'string!MASSES_AND_SPRINGS/naturalLength' );
  const periodTraceString = require( 'string!MASSES_AND_SPRINGS/periodTrace' );

  // constants
  var DEFAULT_CONTENT_SPACING = 155;
  var CONTENT_MAX_WIDTH = 115;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function IndicatorVisibilityControlNode( model, tandem, options ) {
    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'indicatorVisibilityControlNode' ),
      minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 10,
      periodTraceOption: false
    }, options );

    Node.call( this, options );

    // Lines added for reference in panel
    var blackLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'black', tandem.createTandem( 'blackLine' ) );
    var blueLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'rgb( 65, 66, 232 )', tandem.createTandem( 'blueLine' ) );
    var redLine = MassesAndSpringsConstants.CREATE_LINE_ICON( 'red', tandem.createTandem( 'redLine' ) );

    var displacementSymbol = new DisplacementArrowNode(
      new NumberProperty( 10 ),
      new BooleanProperty( true ),
      tandem,
      {
        modelViewTransform: this.modelViewTransform,
        symbolRepresentation: true,
        scale: 0.65
      }
    );
    var alignGroup = new AlignGroup( { matchVertical: false } );

    // Labels for the displacement arrow and natural length line
    var displacementLabels = new VBox( {
      spacing: 8,
      align: 'left',
      children: [
        new Text( displacementString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'displacementString' )
        } ),
        new Text( naturalLengthString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: 110,
          tandem: tandem.createTandem( 'naturalLengthString' )
        } ) ]
    } );

    // the bracket at the left - this is tweaked a bit for optimal appearance
    var bracket = new VBox( {
      children: [
        new BracketNode( {
          orientation: 'left',
          bracketLength: displacementLabels.height < 17 ? 17 : displacementLabels.height,
          bracketLineWidth: 2,
          bracketStroke: 'black',
          bracketTipLocation: 0.475,
          bracketEndRadius: 4,
          bracketTipRadius: 4
        } )
      ]
    } );

    var componentDisplacement = new AlignBox( new HBox( {
      spacing: 2,
      children: [ bracket, displacementLabels ]
    } ), { xAlign: 'left', group: alignGroup } );

    var massEquilibriumAlignBox = new AlignBox( new Text( massEquilibriumString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'massEquilibriumString' )
    } ), { xAlign: 'left', group: alignGroup } );
    var movableLineAlignBox = new AlignBox( new Text( movableLineString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: CONTENT_MAX_WIDTH,
      tandem: tandem.createTandem( 'movableLineString' )
    } ), { xAlign: 'left', group: alignGroup } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    var contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    // Create checkboxes using align boxes above
    var componentDisplacementVBox = new VBox( { children: [ displacementSymbol, blueLine ] } );
    componentDisplacementVBox.spacing = componentDisplacementVBox.height * 0.75;

    // Used for indicator visibility
    var checkboxContent = [ {
      node: new HBox( {
        children: [ componentDisplacement, componentDisplacementVBox ],
        spacing: contentSpacing
      } ),
      property: model.naturalLengthVisibleProperty
    }, {
      node: new HBox( { children: [ massEquilibriumAlignBox, blackLine ], spacing: contentSpacing } ),
      property: model.equilibriumPositionVisibleProperty
    }, {
      node: new HBox( { children: [ movableLineAlignBox, redLine ], spacing: contentSpacing } ),
      property: model.movableLineVisibleProperty
    } ];
    var indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( checkboxContent, {
      checkboxOptions: {
        boxWidth: 16,
        spacing: 8
      },
      tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
    } );

    if ( options.periodTraceOption ) {

      // Push period trace content into checkboxContent
      checkboxContent.push( {
        node: new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: CONTENT_MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceString' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      } );

      indicatorVisibilityCheckboxGroup = new VerticalCheckboxGroup( checkboxContent, {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'indicatorVisibilityCheckboxGroup' )
      } );
    }
    var indicatorVisibilityControlsVBox = new VBox( {
        children: [
          indicatorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'indicatorVisibilityControlsVBox' )
      }
    );
    this.addChild( indicatorVisibilityControlsVBox );
  }

  massesAndSprings.register( 'IndicatorVisibilityControlNode', IndicatorVisibilityControlNode );

  return inherit( Node, IndicatorVisibilityControlNode );
} );